"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ImagePlus, PlayCircle } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import type { Campaign, CampaignFormData, PledgeTier } from "@/types";
import { useCampaigns } from "@/context/CampaignContext";

import { generateId } from "@/lib/utils";

const CATEGORIES = [
  "Technology",
  "Environment",
  "Education",
  "Health",
  "Arts",
  "Community",
] as const;

const OTHER_CATEGORY = "__other__";

type Category = (typeof CATEGORIES)[number];
type StepId = "basics" | "media" | "story" | "pledges" | "review";

type PledgeErrors = {
  title?: string;
  amount?: string;
  description?: string;
  perks?: string;
  itemsLeft?: string;
};

type FormErrors = {
  title?: string;
  tagline?: string;
  category?: string;
  goal?: string;
  daysLeft?: string;
  story?: string;
  coverImage?: string;
  pledges?: PledgeErrors[];
};

const steps: Array<{ id: StepId; label: string; eyebrow: string }> = [
  { id: "basics", label: "Basics", eyebrow: "Start with the essentials" },
  { id: "media", label: "Media", eyebrow: "Add a photo or video" },
  { id: "story", label: "Story", eyebrow: "Tell people why it matters" },
  { id: "pledges", label: "Rewards", eyebrow: "Create pledge tiers" },
  { id: "review", label: "Review", eyebrow: "Check everything before launch" },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function splitPerks(raw: string): string[] {
  return raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
}

function fieldClass(hasError?: boolean) {
  return (
    "mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 " +
    (hasError ? "border-red-300" : "border-black/10")
  );
}

export default function NewCampaignPage() {
  const router = useRouter();
  const { dispatch } = useCampaigns();

  const initialForm = useMemo<CampaignFormData>(
    () => ({
      title: "",
      tagline: "",
      story: "",
      coverImage: "",
      coverMediaType: undefined,
      category: "Technology",
      goal: 1000,
      daysLeft: 7,
      currencyCode: "USD",
      pledges: [
        {
          title: "",
          amount: 25,
          description: "",
          perks: [""],
          itemsLeft: null,
        },
      ],
    }),
    [],
  );

  const [currentStep, setCurrentStep] = useState(0);

  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [form, setForm] = useState<CampaignFormData>(initialForm);

  const [customCategory, setCustomCategory] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeStep = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const campaignCategory =
    form.category === OTHER_CATEGORY ? customCategory.trim() : form.category;

  function clearError(field: keyof Omit<FormErrors, "pledges">) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function clearPledgeError(index: number, fields: Array<keyof PledgeErrors>) {
    setErrors((prev) => {
      if (!prev.pledges?.[index]) return prev;
      const nextPledges = [...prev.pledges];
      nextPledges[index] = { ...nextPledges[index] };
      fields.forEach((field) => {
        nextPledges[index][field] = undefined;
      });
      return { ...prev, pledges: nextPledges };
    });
  }

  function updatePledge(index: number, patch: Partial<PledgeTier>) {
    setForm((prev) => {
      const next = [...prev.pledges];
      next[index] = { ...next[index], ...patch };
      return { ...prev, pledges: next };
    });

    const changedFields = Object.keys(patch).filter(
      (field): field is keyof PledgeErrors =>
        ["title", "amount", "description", "perks", "itemsLeft"].includes(
          field,
        ),
    );
    if (changedFields.length > 0) clearPledgeError(index, changedFields);
  }

  function validate(step: StepId | "all") {
    const nextErrors: FormErrors = {};
    const shouldCheck = (id: StepId) => step === "all" || step === id;

    if (shouldCheck("basics")) {
      if (!form.title.trim()) nextErrors.title = "Title is required.";
      else if (form.title.trim().length > 80)
        nextErrors.title = "Title must be at most 80 characters.";

      if (!form.tagline.trim()) nextErrors.tagline = "Tagline is required.";
      else if (form.tagline.trim().length > 120)
        nextErrors.tagline = "Tagline must be at most 120 characters.";

      if (form.category === OTHER_CATEGORY) {
        if (!campaignCategory) nextErrors.category = "Enter your category.";
        else if (campaignCategory.length > 40)
          nextErrors.category = "Category must be at most 40 characters.";
      } else if (!CATEGORIES.includes(form.category as Category)) {
        nextErrors.category = "Please select a category.";
      }

      if (!Number.isFinite(form.goal) || form.goal < 1000)
        nextErrors.goal = "Funding goal must be at least 1000.";
      if (
        !Number.isFinite(form.daysLeft) ||
        form.daysLeft < 1 ||
        form.daysLeft > 60
      )
        nextErrors.daysLeft = "Duration must be between 1 and 60 days.";
    }

    if (shouldCheck("story") && !form.story.trim()) {
      nextErrors.story = "Tell your story is required.";
    }

    if (shouldCheck("pledges")) {
      const pledgeErrors = form.pledges.map((pledge) => {
        const pledgeError: PledgeErrors = {};
        if (!pledge.title.trim())
          pledgeError.title = "Pledge title is required.";
        if (!Number.isFinite(pledge.amount) || pledge.amount < 1)
          pledgeError.amount = "Amount must be at least 1.";
        if (!pledge.description.trim())
          pledgeError.description = "Description is required.";
        if (!pledge.perks.map(String).some((perk) => perk.trim()))
          pledgeError.perks = "Add at least one perk.";
        if (
          pledge.itemsLeft !== null &&
          (!Number.isInteger(pledge.itemsLeft) || pledge.itemsLeft < 0)
        )
          pledgeError.itemsLeft = "Use a whole number or leave blank.";
        return pledgeError;
      });

      if (pledgeErrors.some((pledge) => Object.keys(pledge).length > 0)) {
        nextErrors.pledges = pledgeErrors;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function buildCampaign(): Campaign {
    return {
      id: generateId(),
      title: form.title.trim(),
      tagline: form.tagline.trim(),
      story: form.story.trim(),
      coverImage: form.coverImage.trim(),
      coverMediaType: form.coverMediaType,
      category: campaignCategory,
      goal: form.goal,
      totalRaised: 0,
      totalBackers: 0,
      daysLeft: form.daysLeft,
      isBookmarked: false,
      currencyCode: "USD",
      pledges: form.pledges.map((pledge) => ({
        id: generateId(),
        title: pledge.title.trim(),
        amount: pledge.amount,
        description: pledge.description.trim(),
        perks: pledge.perks
          .map(String)
          .map((perk) => perk.trim())
          .filter(Boolean),
        itemsLeft: pledge.itemsLeft,
      })),
      createdAt: new Date().toISOString(),
    };
  }

  function goNext() {
    if (!validate(activeStep.id)) return;
    setDirection("next");
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  }

  function goBack() {
    setDirection("previous");
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting || !validate("all")) return;

    setIsSubmitting(true);
    const campaign = buildCampaign();
    dispatch({ type: "ADD_CAMPAIGN", payload: campaign });
    router.push(`/campaigns/${campaign.id}`);
  }

  function addAnotherPledge() {
    setForm((prev) => {
      if (prev.pledges.length >= 4) return prev;
      return {
        ...prev,
        pledges: [
          ...prev.pledges,
          {
            title: "",
            amount: 25,
            description: "",
            perks: [""],
            itemsLeft: null,
          },
        ],
      };
    });
  }

  function removePledge(index: number) {
    setForm((prev) => {
      const next = prev.pledges.filter((_, i) => i !== index);
      return { ...prev, pledges: next.length ? next : prev.pledges };
    });
  }

  function onCoverUpload(file: File | undefined) {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setErrors((prev) => ({
        ...prev,
        coverImage: "Upload an image or video file.",
      }));
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        coverImage: "Upload a file smaller than 6MB.",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        coverImage: String(reader.result ?? ""),
        coverMediaType: isVideo ? "video" : "image",
      }));
      setErrors((prev) => ({ ...prev, coverImage: undefined }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] bg-[#F7F5F0]">
        <form
          onSubmit={onSubmit}
          className="flex min-h-[calc(100vh-4rem)] flex-col"
        >
          <header className="border-b border-black/10 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] shadow-sm transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back
                </Link>
                <p className="text-sm font-medium text-[#1A1A1A]/60">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  {steps.map((step, index) => {
                    const isDone = index < currentStep;
                    const isActive = index === currentStep;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => {
                          if (index <= currentStep || validate(activeStep.id)) {
                            setDirection(
                              index > currentStep ? "next" : "previous",
                            );
                            setCurrentStep(index);
                          }
                        }}
                        className="flex min-w-0 flex-1 items-center gap-2 rounded-xl p-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                      >
                        <span
                          className={
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold " +
                            (isDone
                              ? "bg-[#02A95C] text-white"
                              : isActive
                                ? "bg-[#1A1A1A] text-white"
                                : "bg-black/10 text-[#1A1A1A]/60")
                          }
                        >
                          {isDone ? <Check className="h-4 w-4" /> : index + 1}
                        </span>
                        <span className="hidden min-w-0 sm:block">
                          <span className="block truncate text-sm font-semibold">
                            {step.label}
                          </span>
                          <span className="block truncate text-xs text-[#1A1A1A]/55">
                            {step.eyebrow}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-[#02A95C] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </header>

          <section className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-8">
            <div
              key={activeStep.id}
              className={
                "grid w-full grid-cols-1 gap-8 transition-all duration-300 lg:grid-cols-[340px_minmax(0,1fr)] " +
                (direction === "next"
                  ? "animate-[stepInRight_260ms_ease-out]"
                  : "animate-[stepInLeft_260ms_ease-out]")
              }
            >
              <aside className="rounded-3xl bg-[#D8F3DC] p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2D6A4F]">
                  {activeStep.label}
                </p>
                <h1 className="mt-3 font-(--font-display) text-4xl leading-tight">
                  {activeStep.eyebrow}
                </h1>
                <p className="mt-4 text-sm text-[#1A1A1A]/70">
                  Build your campaign in focused steps. You can review every
                  detail before the project goes live.
                </p>
              </aside>

              <div className="rounded-3xl bg-white p-6 shadow-sm lg:p-8">
                {activeStep.id === "basics" ? (
                  <BasicsStep
                    form={form}
                    setForm={setForm}
                    customCategory={customCategory}
                    setCustomCategory={setCustomCategory}
                    errors={errors}
                    clearError={clearError}
                  />
                ) : null}

                {activeStep.id === "media" ? (
                  <MediaStep
                    form={form}
                    errors={errors}
                    onCoverUpload={onCoverUpload}
                  />
                ) : null}

                {activeStep.id === "story" ? (
                  <StoryStep
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    clearError={clearError}
                  />
                ) : null}

                {activeStep.id === "pledges" ? (
                  <PledgesStep
                    pledges={form.pledges}
                    errors={errors}
                    updatePledge={updatePledge}
                    addAnotherPledge={addAnotherPledge}
                    removePledge={removePledge}
                  />
                ) : null}

                {activeStep.id === "review" ? (
                  <ReviewStep
                    form={form}
                    category={campaignCategory}
                    goToStep={(step) => {
                      setDirection(step > currentStep ? "next" : "previous");
                      setCurrentStep(step);
                    }}
                  />
                ) : null}
              </div>
            </div>
          </section>

          <footer className="border-t border-black/10 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
              <button
                type="button"
                onClick={goBack}
                disabled={currentStep === 0}
                className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {activeStep.id === "review" ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-[#02A95C] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#018A4B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Launching..." : "Launch Project"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep.id === "pledges") {
                      if (!validate(activeStep.id)) return;
                      setDirection("next");
                      setCurrentStep((step) =>
                        Math.min(step + 1, steps.length - 1),
                      );
                      return;
                    }
                    goNext();
                  }}
                  className="rounded-full bg-[#02A95C] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#018A4B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                >
                  Continue
                </button>
              )}
            </div>
          </footer>
        </form>
      </main>
    </>
  );
}

function BasicsStep({
  form,
  setForm,
  customCategory,
  setCustomCategory,
  errors,
  clearError,
}: {
  form: CampaignFormData;
  setForm: React.Dispatch<React.SetStateAction<CampaignFormData>>;
  customCategory: string;
  setCustomCategory: (value: string) => void;
  errors: FormErrors;
  clearError: (field: keyof Omit<FormErrors, "pledges">) => void;
}) {
  return (
    <div>
      <h2 className="font-(--font-display) text-3xl">Project basics</h2>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          id="campaign-title"
          label="Campaign title"
          value={form.title}
          error={errors.title}
          placeholder="Help rebuild a community garden"
          onChange={(value) => {
            setForm((prev) => ({ ...prev, title: value }));
            clearError("title");
          }}
        />
        <TextField
          id="campaign-tagline"
          label="Short tagline"
          value={form.tagline}
          error={errors.tagline}
          placeholder="A simple sentence people remember"
          onChange={(value) => {
            setForm((prev) => ({ ...prev, tagline: value }));
            clearError("tagline");
          }}
        />
        <div>
          <label
            htmlFor="campaign-category"
            className="block text-sm font-medium"
          >
            Category
          </label>
          <select
            id="campaign-category"
            value={form.category}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, category: event.target.value }));
              clearError("category");
            }}
            className={fieldClass(Boolean(errors.category))}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            <option value={OTHER_CATEGORY}>Other</option>
          </select>
          {form.category === OTHER_CATEGORY ? (
            <input
              value={customCategory}
              onChange={(event) => {
                setCustomCategory(event.target.value);
                clearError("category");
              }}
              className={fieldClass(Boolean(errors.category))}
              placeholder="Type your category"
            />
          ) : null}
          {errors.category ? (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          ) : null}
        </div>
        <TextField
          id="campaign-goal"
          label="Funding goal"
          type="number"
          value={String(form.goal)}
          error={errors.goal}
          onChange={(value) => {
            setForm((prev) => ({
              ...prev,
              goal: value === "" ? NaN : Number(value),
            }));
            clearError("goal");
          }}
        />
        <TextField
          id="campaign-days-left"
          label="Campaign duration in days"
          type="number"
          value={Number.isFinite(form.daysLeft) ? String(form.daysLeft) : ""}
          error={errors.daysLeft}
          onChange={(value) => {
            setForm((prev) => ({
              ...prev,
              daysLeft: value === "" ? NaN : Number(value),
            }));
            clearError("daysLeft");
          }}
        />
      </div>
    </div>
  );
}

function MediaStep({
  form,
  errors,
  onCoverUpload,
}: {
  form: CampaignFormData;
  errors: FormErrors;
  onCoverUpload: (file: File | undefined) => void;
}) {
  return (
    <div>
      <h2 className="font-(--font-display) text-3xl">Campaign media</h2>
      <p className="mt-2 text-sm text-[#1A1A1A]/65">
        Upload a photo or video from your device. This will become the campaign
        cover.
      </p>
      <label
        htmlFor="campaign-cover"
        className="mt-6 flex min-h-90 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#2D6A4F]/30 bg-[#F7F5F0] p-5 text-center transition hover:border-[#2D6A4F] hover:bg-green-50 focus-within:ring-2 focus-within:ring-[#2D6A4F] focus-within:ring-offset-2"
      >
        {form.coverImage ? (
          <div className="w-full overflow-hidden rounded-2xl">
            {form.coverMediaType === "video" ? (
              <video
                src={form.coverImage}
                className="h-90 w-full object-cover"
                controls
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.coverImage}
                alt="Campaign cover preview"
                className="h-90 w-full object-cover"
              />
            )}
          </div>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <ImagePlus
                className="h-7 w-7 text-[#2D6A4F]"
                aria-hidden="true"
              />
            </div>
            <p className="mt-4 text-base font-semibold">Upload cover media</p>
            <p className="mt-1 max-w-md text-sm text-[#1A1A1A]/60">
              Use an image or short video up to 6MB.
            </p>
          </>
        )}
        <input
          id="campaign-cover"
          type="file"
          accept="image/*,video/*"
          onChange={(event) => onCoverUpload(event.target.files?.[0])}
          className="sr-only"
        />
      </label>
      <div className="mt-2 flex items-center gap-2 text-xs text-[#1A1A1A]/60">
        {form.coverMediaType === "video" ? (
          <PlayCircle className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
        )}
        <span>Images or videos up to 6MB.</span>
      </div>
      {errors.coverImage ? (
        <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>
      ) : null}
    </div>
  );
}

function StoryStep({
  form,
  setForm,
  errors,
  clearError,
}: {
  form: CampaignFormData;
  setForm: React.Dispatch<React.SetStateAction<CampaignFormData>>;
  errors: FormErrors;
  clearError: (field: keyof Omit<FormErrors, "pledges">) => void;
}) {
  return (
    <div>
      <h2 className="font-(--font-display) text-3xl">Tell your story</h2>
      <textarea
        value={form.story}
        onChange={(event) => {
          setForm((prev) => ({ ...prev, story: event.target.value }));
          clearError("story");
        }}
        className={
          "mt-6 min-h-105 w-full rounded-2xl border bg-white px-5 py-4 outline-none transition focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 " +
          (errors.story ? "border-red-300" : "border-black/10")
        }
        placeholder="Share what happened, who this helps, and how funds will be used."
      />
      {errors.story ? (
        <p className="mt-1 text-sm text-red-600">{errors.story}</p>
      ) : null}
    </div>
  );
}

function PledgesStep({
  pledges,
  errors,
  updatePledge,
  addAnotherPledge,
  removePledge,
}: {
  pledges: CampaignFormData["pledges"];
  errors: FormErrors;
  updatePledge: (index: number, patch: Partial<PledgeTier>) => void;
  addAnotherPledge: () => void;
  removePledge: (index: number) => void;
}) {
  return (
    <div>
      <h2 className="font-(--font-display) text-3xl">Reward tiers</h2>
      <div className="mt-6 space-y-5">
        {pledges.map((pledge, index) => {
          const pledgeErrors = errors.pledges?.[index] ?? {};
          return (
            <div key={index} className="rounded-2xl border border-black/10 p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-(--font-display) text-xl">
                  Tier {index + 1}
                </h3>
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => removePledge(index)}
                    className="rounded-md text-sm text-red-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  id={`pledge-${index}-title`}
                  label="Title"
                  value={pledge.title}
                  error={pledgeErrors.title}
                  onChange={(value) => updatePledge(index, { title: value })}
                />
                <TextField
                  id={`pledge-${index}-amount`}
                  label="Amount"
                  type="number"
                  value={
                    Number.isFinite(pledge.amount) ? String(pledge.amount) : ""
                  }
                  error={pledgeErrors.amount}
                  onChange={(value) =>
                    updatePledge(index, {
                      amount: value === "" ? NaN : Number(value),
                    })
                  }
                />
                <TextField
                  id={`pledge-${index}-items`}
                  label="Items available"
                  type="number"
                  value={pledge.itemsLeft ?? ""}
                  error={pledgeErrors.itemsLeft}
                  placeholder="Blank = unlimited"
                  onChange={(value) =>
                    updatePledge(index, {
                      itemsLeft: value === "" ? null : Number(value),
                    })
                  }
                />
                <TextField
                  id={`pledge-${index}-perks`}
                  label="Perks, comma-separated"
                  value={(pledge.perks ?? []).join(", ")}
                  error={pledgeErrors.perks}
                  onChange={(value) =>
                    updatePledge(index, { perks: splitPerks(value) })
                  }
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={pledge.description}
                  onChange={(event) =>
                    updatePledge(index, { description: event.target.value })
                  }
                  className={
                    "mt-2 min-h-24 w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 " +
                    (pledgeErrors.description
                      ? "border-red-300"
                      : "border-black/10")
                  }
                />
                {pledgeErrors.description ? (
                  <p className="mt-1 text-sm text-red-600">
                    {pledgeErrors.description}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {pledges.length < 4 ? (
        <button
          type="button"
          onClick={addAnotherPledge}
          className="mt-5 w-full rounded-full border border-black/10 px-5 py-3 text-sm font-semibold transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
        >
          Add Another Tier
        </button>
      ) : null}
    </div>
  );
}

function ReviewStep({
  form,
  category,
  goToStep,
}: {
  form: CampaignFormData;
  category: string;
  goToStep: (step: number) => void;
}) {
  return (
    <div>
      <h2 className="font-(--font-display) text-3xl">Review project</h2>
      <p className="mt-2 text-sm text-[#1A1A1A]/65">
        Preview all campaign details before launching. Use the edit buttons to
        jump back to any section.
      </p>

      <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white">
        <div className="overflow-hidden bg-[#F7F5F0]">
          {form.coverImage ? (
            form.coverMediaType === "video" ? (
              <video
                src={form.coverImage}
                className="h-72 w-full object-cover"
                controls
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.coverImage}
                alt="Campaign cover preview"
                className="h-72 w-full object-cover"
              />
            )
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-[#1A1A1A]/50">
              No media uploaded
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#2D6A4F]">
                {category || "Uncategorized"}
              </span>
              <h3 className="mt-3 font-(--font-display) text-4xl leading-tight">
                {form.title || "Untitled campaign"}
              </h3>
              <p className="mt-2 text-[#1A1A1A]/70">
                {form.tagline || "No tagline entered."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToStep(0)}
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#2D6A4F] hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
            >
              Edit basics
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ReviewMetric
              label="Funding goal"
              value={currency.format(
                Number.isFinite(form.goal) ? form.goal : 0,
              )}
            />
            <ReviewMetric
              label="Duration"
              value={`${form.daysLeft || 0} days`}
            />
            <ReviewMetric
              label="Reward tiers"
              value={form.pledges.length.toLocaleString()}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ReviewCard title="Story" onEdit={() => goToStep(2)}>
          <div className="max-h-72 overflow-auto rounded-xl bg-[#F7F5F0] p-4">
            <p className="whitespace-pre-wrap text-sm leading-6 text-[#1A1A1A]/75">
              {form.story || "No story yet."}
            </p>
          </div>
        </ReviewCard>

        <ReviewCard title="Media" onEdit={() => goToStep(1)}>
          <dl className="grid grid-cols-1 gap-3 text-sm">
            <div className="rounded-xl bg-[#F7F5F0] p-3">
              <dt className="text-[#1A1A1A]/55">Media status</dt>
              <dd className="mt-1 font-semibold">
                {form.coverImage
                  ? `${form.coverMediaType === "video" ? "Video" : "Image"} uploaded`
                  : "No media uploaded"}
              </dd>
            </div>
          </dl>
        </ReviewCard>

        <ReviewCard title="Reward tiers" onEdit={() => goToStep(3)}>
          <div className="space-y-3">
            {form.pledges.map((pledge, index) => (
              <div key={index} className="rounded-xl bg-[#F7F5F0] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {pledge.title || `Tier ${index + 1}`}
                    </p>
                    <p className="mt-1 text-xs text-[#1A1A1A]/60">
                      {pledge.description || "No description entered."}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold">
                    {currency.format(
                      Number.isFinite(pledge.amount) ? pledge.amount : 0,
                    )}
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-[#1A1A1A]/65 sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-[#1A1A1A]">Items:</span>{" "}
                    {pledge.itemsLeft === null ? "Unlimited" : pledge.itemsLeft}
                  </p>
                  <p>
                    <span className="font-semibold text-[#1A1A1A]">Perks:</span>{" "}
                    {(pledge.perks ?? []).filter(Boolean).join(", ") ||
                      "No perks"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ReviewCard>

        <ReviewCard title="Launch checklist" onEdit={() => goToStep(0)}>
          <ul className="space-y-3 text-sm text-[#1A1A1A]/70">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#02A95C]" aria-hidden="true" />
              Basics completed
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#02A95C]" aria-hidden="true" />
              Story added
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#02A95C]" aria-hidden="true" />
              {form.pledges.length} reward tier
              {form.pledges.length === 1 ? "" : "s"} ready
            </li>
          </ul>
        </ReviewCard>
      </div>
    </div>
  );
}

function ReviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F7F5F0] p-4">
      <p className="text-xs font-medium text-[#1A1A1A]/55">{label}</p>
      <p className="mt-1 text-lg font-bold text-[#1A1A1A]">{value}</p>
    </div>
  );
}

function ReviewCard({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <section className="rounded-2xl border border-black/10 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full px-3 py-1 text-sm font-medium text-[#2D6A4F] hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
        >
          Edit
        </button>
      </div>
      {children}
    </section>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass(Boolean(error))}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import type { Campaign } from "@/types";
import { useCampaigns } from "@/context/CampaignContext";
import Link from "next/link";
import Badge from "@/components/shared/Badge";
import { Bookmark, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, calcPercent } from "@/lib/utils";

const categoryGradient: Record<string, string> = {
  Technology: "from-[#4F46E5] to-[#22C55E]",
  Environment: "from-[#2D6A4F] to-[#74C69D]",
  Arts: "from-[#EC4899] to-[#F59E0B]",
  Education: "from-[#3B82F6] to-[#06B6D4]",
  Health: "from-[#DC2626] to-[#F97316]",
  Community: "from-[#22C55E] to-[#F97316]",
};

type EditForm = {
  title: string;
  tagline: string;
  category: string;
  goal: string;
  daysLeft: string;
};

export function CampaignCard({
  campaign,
  index = 0,
}: {
  campaign: Campaign;
  index?: number;
}) {
  const { dispatch } = useCampaigns();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    title: campaign.title,
    tagline: campaign.tagline,
    category: campaign.category,
    goal: String(campaign.goal),
    daysLeft: String(campaign.daysLeft),
  });

  const pct = calcPercent(campaign.totalRaised, campaign.goal);
  const gradient =
    categoryGradient[campaign.category] ?? "from-[#111827] to-[#6366F1]";

  function updateEditForm(name: keyof EditForm, value: string) {
    setEditForm((current) => ({ ...current, [name]: value }));
  }

  function resetEditForm() {
    setEditForm({
      title: campaign.title,
      tagline: campaign.tagline,
      category: campaign.category,
      goal: String(campaign.goal),
      daysLeft: String(campaign.daysLeft),
    });
  }

  function onSaveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = editForm.title.trim();
    const tagline = editForm.tagline.trim();
    const category = editForm.category.trim();
    const goal = Number(editForm.goal);
    const daysLeft = Number(editForm.daysLeft);

    if (!title || !tagline || !category || goal < 1 || daysLeft < 1) {
      toast.error("Edit needs valid project details");
      return;
    }

    dispatch({
      type: "UPDATE_CAMPAIGN",
      payload: {
        campaignId: campaign.id,
        updates: {
          title,
          tagline,
          category,
          goal,
          daysLeft,
        },
      },
    });
    setIsEditing(false);
    toast.success("Project updated", {
      description: `${title} was edited successfully.`,
    });
  }

  function onDelete() {
    dispatch({
      type: "DELETE_CAMPAIGN",
      payload: { campaignId: campaign.id },
    });
    toast.success("Project deleted", {
      description: `${campaign.title} was removed successfully.`,
    });
  }

  if (isEditing) {
    return (
      <article
        className="w-full rounded-2xl border border-black/5 bg-white p-5 opacity-0 shadow-sm motion-safe:animate-[cardFadeIn_450ms_ease-out_forwards]"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <form onSubmit={onSaveEdit} className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-[var(--font-display)] text-xl">
              Edit Project
            </h2>
            <button
              type="button"
              aria-label="Cancel editing"
              onClick={() => {
                resetEditForm();
                setIsEditing(false);
              }}
              className="rounded-full p-2 transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div>
            <label htmlFor={`${campaign.id}-title`} className="text-sm font-medium">
              Title
            </label>
            <input
              id={`${campaign.id}-title`}
              value={editForm.title}
              onChange={(event) => updateEditForm("title", event.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
            />
          </div>

          <div>
            <label
              htmlFor={`${campaign.id}-tagline`}
              className="text-sm font-medium"
            >
              Tagline
            </label>
            <textarea
              id={`${campaign.id}-tagline`}
              value={editForm.tagline}
              onChange={(event) => updateEditForm("tagline", event.target.value)}
              className="mt-2 min-h-20 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
            />
          </div>

          <div>
            <label
              htmlFor={`${campaign.id}-category`}
              className="text-sm font-medium"
            >
              Category
            </label>
            <input
              id={`${campaign.id}-category`}
              value={editForm.category}
              onChange={(event) =>
                updateEditForm("category", event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${campaign.id}-goal`} className="text-sm font-medium">
                Goal
              </label>
              <input
                id={`${campaign.id}-goal`}
                type="number"
                min={1}
                value={editForm.goal}
                onChange={(event) => updateEditForm("goal", event.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label
                htmlFor={`${campaign.id}-days-left`}
                className="text-sm font-medium"
              >
                Days left
              </label>
              <input
                id={`${campaign.id}-days-left`}
                type="number"
                min={1}
                value={editForm.daysLeft}
                onChange={(event) =>
                  updateEditForm("daysLeft", event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#1A1A1A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
          >
            Save Changes
          </button>
        </form>
      </article>
    );
  }

  return (
    <article
      className="group relative w-full overflow-hidden rounded-2xl border border-black/5 bg-white opacity-0 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md motion-safe:animate-[cardFadeIn_450ms_ease-out_forwards]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link
        href={`/campaigns/${campaign.id}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
      >
        {campaign.coverImage && campaign.coverMediaType === "video" ? (
          <video
            className="h-36 w-full object-cover"
            src={campaign.coverImage}
            muted
            loop
            playsInline
            aria-label={`${campaign.title} campaign video`}
          />
        ) : campaign.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="h-36 w-full object-cover"
            src={campaign.coverImage}
            alt={`${campaign.title} campaign cover`}
          />
        ) : (
          <div className={`h-36 bg-gradient-to-br ${gradient}`} aria-hidden />
        )}

        <div className="p-5">
          <div className="flex items-start justify-between gap-12">
            <Badge label={campaign.category} color="gray" />
          </div>

          <h2 className="mt-3 font-[var(--font-display)] text-xl leading-tight">
            {campaign.title}
          </h2>

          <p className="mt-1 line-clamp-2 text-sm text-[#1A1A1A]/70">
            {campaign.tagline}
          </p>

          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full bg-[#1A1A1A]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 text-sm font-medium">
              {formatCurrency(campaign.totalRaised)} raised of{" "}
              {formatCurrency(campaign.goal)} goal
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-[#1A1A1A]/65">
            <span>{campaign.totalBackers.toLocaleString()} backers</span>
            <span>{campaign.daysLeft} days left</span>
          </div>
        </div>
      </Link>

      <div className="absolute right-4 top-36 flex gap-2">
        <button
          type="button"
          aria-label={
            campaign.isBookmarked
              ? `Remove bookmark for ${campaign.title}`
              : `Bookmark ${campaign.title}`
          }
          onClick={() => {
            dispatch({
              type: "TOGGLE_BOOKMARK",
              payload: { campaignId: campaign.id },
            });
          }}
          className="rounded-full bg-white/90 p-2 text-[#1A1A1A] shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
        >
          <Bookmark
            className={campaign.isBookmarked ? "fill-[#1A1A1A]" : "fill-none"}
            size={18}
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          aria-label={`Edit ${campaign.title}`}
          onClick={() => setIsEditing(true)}
          className="rounded-full bg-white/90 p-2 text-[#1A1A1A] shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
        >
          <Pencil className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label={`Delete ${campaign.title}`}
          onClick={onDelete}
          className="rounded-full bg-white/90 p-2 text-red-600 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          <Trash2 className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

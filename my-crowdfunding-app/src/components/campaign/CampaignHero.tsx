"use client";

import React, { useMemo, useState } from "react";
import type { Campaign } from "@/types";

import BookmarkButton from "@/components/campaign/BookmarkButton";

export default function CampaignHero({
  campaign,
  onToggleBookmark,
}: {
  campaign: Campaign;
  onToggleBookmark: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const storyText = campaign.story ?? "";
  const shouldShowStoryToggle = useMemo(() => {
    // We only know the line count visually, so follow the spec and always render
    // the control when story exists.
    return Boolean(storyText.trim());
  }, [storyText]);
  const hasCoverMedia = Boolean(campaign.coverImage);

  return (
    <section
      className={
        "relative min-h-[430px] overflow-hidden rounded-2xl bg-white shadow-sm " +
        (campaign.coverImage
          ? ""
          : "bg-gradient-to-br from-[#2D6A4F]/10 via-white to-[#74C69D]/10")
      }
    >
      {campaign.coverImage && campaign.coverMediaType === "video" ? (
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={campaign.coverImage}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10" />
        </>
      ) : campaign.coverImage ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.55), rgba(2,6,23,0.15)), url(${campaign.coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D6A4F]/15 to-[#74C69D]/10" />
      )}

      <div className="relative flex min-h-[430px] items-end p-6 sm:p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div
              className={
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium " +
                (hasCoverMedia
                  ? "bg-white/20 text-white"
                  : "bg-black/10 text-black/70")
              }
            >
              {campaign.category}
            </div>

            <h1
              className={
                "mt-3 font-[var(--font-display)] text-4xl leading-tight sm:text-5xl " +
                (hasCoverMedia ? "text-white" : "text-[#1A1A1A]")
              }
            >
              {campaign.title}
            </h1>

            <p
              className={
                "mt-2 text-lg " +
                (hasCoverMedia ? "text-white/85" : "text-[#1A1A1A]/75")
              }
            >
              {campaign.tagline}
            </p>

            {storyText ? (
              <div className="mt-4">
                <p
                  className={
                    "whitespace-pre-wrap " +
                    (hasCoverMedia ? "text-white/85 " : "text-[#1A1A1A]/85 ") +
                    (isExpanded ? "" : "line-clamp-3")
                  }
                >
                  {storyText}
                </p>

                {shouldShowStoryToggle ? (
                  <button
                    type="button"
                    onClick={() => setIsExpanded((v) => !v)}
                    className={
                      "mt-2 inline-flex rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 " +
                      (hasCoverMedia
                        ? "text-white underline-offset-4 hover:underline"
                        : "text-[#2D6A4F] hover:text-[#1f5a3d]")
                    }
                  >
                    {isExpanded ? "Read less" : "Read more"}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="shrink-0">
            <BookmarkButton
              isBookmarked={campaign.isBookmarked}
              onToggle={onToggleBookmark}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

export default function BookmarkButton({
  isBookmarked,
  onToggle,
}: {
  isBookmarked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 " +
        (isBookmarked
          ? "border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200"
          : "border-black/10 bg-white text-[#1A1A1A] hover:bg-black/5")
      }
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark campaign"}
    >
      {isBookmarked ? (
        <BookmarkCheck
          className="h-4 w-4 scale-110 fill-amber-500 text-amber-600 transition-transform duration-200"
          aria-hidden="true"
        />
      ) : (
        <Bookmark
          className="h-4 w-4 transition-transform duration-200"
          aria-hidden="true"
        />
      )}
      <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
    </button>
  );
}

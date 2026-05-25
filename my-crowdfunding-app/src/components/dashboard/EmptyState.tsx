import { Rocket } from "lucide-react";
import Button from "@/components/shared/Button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center">
        <Rocket className="text-[#1A1A1A]" size={28} />
      </div>
      <h3 className="mt-5 font-[var(--font-display)] text-2xl">
        No campaigns yet
      </h3>
      <p className="mt-2 text-sm text-[#1A1A1A]/70 max-w-md">
        Be the first to launch a new idea.
      </p>

      <div className="mt-6">
        <Button href="/campaigns/new" variant="primary" size="md">
          Start the first one
        </Button>
      </div>
    </div>
  );
}

import type { Campaign } from "@/types";
import { CampaignCard } from "./CampaignCard";
import { EmptyState } from "./EmptyState";

export default function CampaignGrid({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {campaigns.map((campaign, index) => (
        <CampaignCard key={campaign.id} campaign={campaign} index={index} />
      ))}
    </div>
  );
}

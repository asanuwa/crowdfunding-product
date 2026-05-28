import type { Campaign } from "../types";

const STORAGE_KEY = "crowdforge_campaigns";
const LEGACY_SEED_CAMPAIGN_IDS = new Set([
  "lunarseed_verticalfarmkit_001",
  "arkive_offline_library_backpack_001",
  "solarpedal_ebike_africa_cities_001",
]);

function removeLegacySeedCampaigns(campaigns: Campaign[]): Campaign[] {
  return campaigns.filter(
    (campaign) => !LEGACY_SEED_CAMPAIGN_IDS.has(campaign.id),
  );
}

export function saveCampaigns(campaigns: Campaign[]): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  } catch {
    // ignore
  }
}

export function loadCampaigns(): Campaign[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Campaign[];
    return Array.isArray(parsed) ? removeLegacySeedCampaigns(parsed) : [];
  } catch {
    return [];
  }
}

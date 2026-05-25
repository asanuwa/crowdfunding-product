export interface PledgeTier {
  id: string;
  title: string;
  amount: number;
  description: string;
  perks: string[];
  itemsLeft: number | null; // null = unlimited
  selected?: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  tagline: string;
  story: string;
  coverImage: string; // URL string or empty string
  coverMediaType?: "image" | "video";
  category: string; // e.g. "Technology", "Environment"
  goal: number;
  totalRaised: number;
  totalBackers: number;
  daysLeft: number;
  isBookmarked: boolean;
  currencyCode: string; // e.g. "USD", "EUR"
  pledges: PledgeTier[];
  createdAt: string; // ISO date string
}

export interface CampaignFormData {
  title: string;
  tagline: string;
  story: string;
  coverImage: string;
  coverMediaType?: "image" | "video";
  category: string;
  goal: number;
  daysLeft: number;
  currencyCode: string;
  pledges: Omit<PledgeTier, "id">[];
}

export interface AppState {
  campaigns: Campaign[];
}

export type AppAction =
  | { type: "ADD_CAMPAIGN"; payload: Campaign }
  | {
      type: "UPDATE_CAMPAIGN";
      payload: {
        campaignId: string;
        updates: Pick<
          Campaign,
          "title" | "tagline" | "category" | "goal" | "daysLeft"
        >;
      };
    }
  | {
      type: "DELETE_CAMPAIGN";
      payload: { campaignId: string };
    }
  | {
      type: "SELECT_PLEDGE";
      payload: { campaignId: string; pledgeId: string };
    }
  | {
      type: "CONFIRM_PLEDGE";
      payload: { campaignId: string; pledgeId: string };
    }
  | {
      type: "RECORD_QUICK_PLEDGE";
      payload: { campaignId: string; amount: number };
    }
  | {
      type: "TOGGLE_BOOKMARK";
      payload: { campaignId: string };
    }
  | { type: "LOAD_CAMPAIGNS"; payload: Campaign[] };

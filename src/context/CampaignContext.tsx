"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { AppAction, AppState, Campaign, PledgeTier } from "../types";
import { loadCampaigns, saveCampaigns } from "../lib/storage";

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "LOAD_CAMPAIGNS": {
      return {
        ...state,
        campaigns: action.payload,
      };
    }

    case "ADD_CAMPAIGN": {
      const nextCampaigns = [...state.campaigns, action.payload];
      saveCampaigns(nextCampaigns);
      return { ...state, campaigns: nextCampaigns };
    }

    case "UPDATE_CAMPAIGN": {
      const { campaignId, updates } = action.payload;
      const nextCampaigns = state.campaigns.map((c) =>
        c.id === campaignId ? { ...c, ...updates } : c,
      );
      saveCampaigns(nextCampaigns);
      return { ...state, campaigns: nextCampaigns };
    }

    case "DELETE_CAMPAIGN": {
      const { campaignId } = action.payload;
      const nextCampaigns = state.campaigns.filter((c) => c.id !== campaignId);
      saveCampaigns(nextCampaigns);
      return { ...state, campaigns: nextCampaigns };
    }

    case "SELECT_PLEDGE": {
      const { campaignId, pledgeId } = action.payload;
      const nextCampaigns = state.campaigns.map((c) => {
        if (c.id !== campaignId) return c;
        const nextPledges = c.pledges.map((p) =>
          p.id === pledgeId
            ? { ...p, selected: true }
            : ({ ...p, selected: false } as PledgeTier),
        );
        return { ...c, pledges: nextPledges };
      });

      return { ...state, campaigns: nextCampaigns };
    }

    case "CONFIRM_PLEDGE": {
      const { campaignId, pledgeId } = action.payload;
      const nextCampaigns = state.campaigns.map((c) => {
        if (c.id !== campaignId) return c;

        const selected = c.pledges.find((p) => p.id === pledgeId);
        if (!selected) return c;

        const pledgedAmount = selected.amount;
        const nextTotalRaised = c.totalRaised + pledgedAmount;
        const nextTotalBackers = c.totalBackers + 1;

        const nextPledges = c.pledges.map((p) => {
          if (p.id !== pledgeId) return { ...p, selected: false };

          const currentLeft = p.itemsLeft;
          const nextLeft =
            currentLeft === null ? null : Math.max(0, (currentLeft ?? 0) - 1);

          return { ...p, itemsLeft: nextLeft, selected: false };
        });

        const nextCampaign: Campaign = {
          ...c,
          totalRaised: nextTotalRaised,
          totalBackers: nextTotalBackers,
          pledges: nextPledges,
        };

        return nextCampaign;
      });

      saveCampaigns(nextCampaigns);
      return { ...state, campaigns: nextCampaigns };
    }

    case "RECORD_QUICK_PLEDGE": {
      const { campaignId, amount } = action.payload;
      const nextCampaigns = state.campaigns.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              totalRaised: c.totalRaised + amount,
              totalBackers: c.totalBackers + 1,
            }
          : c,
      );
      saveCampaigns(nextCampaigns);
      return { ...state, campaigns: nextCampaigns };
    }

    case "TOGGLE_BOOKMARK": {
      const { campaignId } = action.payload;
      const nextCampaigns = state.campaigns.map((c) =>
        c.id === campaignId ? { ...c, isBookmarked: !c.isBookmarked } : c,
      );
      saveCampaigns(nextCampaigns);
      return { ...state, campaigns: nextCampaigns };
    }

    default:
      return state;
  }
}

type CampaignContextValue = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getCampaign: (id: string) => Campaign | undefined;
};

const CampaignContext = createContext<CampaignContextValue | undefined>(
  undefined,
);

export function useCampaigns() {
  const ctx = useContext(CampaignContext);
  if (!ctx)
    throw new Error("useCampaigns must be used within CampaignProvider");
  return ctx;
}

export function CampaignProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [state, dispatch] = useReducer(appReducer, { campaigns: [] });

  useEffect(() => {
    dispatch({ type: "LOAD_CAMPAIGNS", payload: loadCampaigns() });
  }, []);

  const getCampaign = useCallback(
    (id: string) => state.campaigns.find((c) => c.id === id),
    [state.campaigns],
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      getCampaign,
    }),
    [state, dispatch, getCampaign],
  );

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
}

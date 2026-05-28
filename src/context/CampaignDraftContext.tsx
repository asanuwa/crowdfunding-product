"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { CampaignFormData } from "@/types";

type CampaignDraftContextValue = {
  draft: CampaignFormData | null;
  setDraft: React.Dispatch<React.SetStateAction<CampaignFormData | null>>;
};

const CampaignDraftContext = createContext<
  CampaignDraftContextValue | undefined
>(undefined);

export function CampaignDraftProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [draft, setDraft] = useState<CampaignFormData | null>(null);

  const value = useMemo(
    () => ({
      draft,
      setDraft,
    }),
    [draft],
  );

  return (
    <CampaignDraftContext.Provider value={value}>
      {children}
    </CampaignDraftContext.Provider>
  );
}

export function useCampaignDraft() {
  const ctx = useContext(CampaignDraftContext);
  if (!ctx) {
    throw new Error(
      "useCampaignDraft must be used within CampaignDraftProvider",
    );
  }
  return ctx;
}

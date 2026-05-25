# TODO

## Currency-by-country update

- [ ] Add `currencyCode` to `Campaign` and `CampaignFormData` types
- [ ] Add Country/Currency selector UI to `src/app/campaigns/new/page.tsx`
- [ ] Update pledge tier amount label + number formatting in the new campaign form
- [ ] Replace hardcoded `$` / `USD` formatting in campaign pages/components:
  - [ ] `PledgeCard`
  - [ ] `PledgeSection`
  - [ ] `StatsBar`
  - [ ] `SuccessModal`
- [ ] Ensure seed campaigns compile (add default currencyCode if needed)
- [ ] Run lint/build to verify

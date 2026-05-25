import type { Campaign } from "../types";

export const seedCampaigns: Campaign[] = [
  {
    id: "lunarseed_verticalfarmkit_001",
    title: "LunarSeed Vertical Farm Kit",
    tagline: "Grow fresh produce with a compact vertical farm",
    story:
      "Bring lunar-inspired agriculture to your home: modular trays, efficient grow lighting, and a guided setup so anyone can harvest crisp greens year-round.",
    coverImage: "",
    category: "Environment",
    goal: 50000,
    totalRaised: 29914,
    totalBackers: 5007,
    daysLeft: 22,
    isBookmarked: false,
    currencyCode: "USD",
    pledges: [
      {
        id: "tier_lunar_25_seed_supporter",
        title: "Seed Supporter",
        amount: 25,
        description:
          "A starter bundle of non-GMO seeds + cultivation guide to kick off your first harvest.",
        perks: ["Seed pack", "Planting guide", "Harvest timeline sheet"],
        itemsLeft: null,
      },
      {
        id: "tier_lunar_75_early_bird_kit",
        title: "Early Bird Kit",
        amount: 75,
        description:
          "Reserved spot for the full Vertical Farm Kit with priority shipping.",
        perks: ["Vertical farm kit", "Priority shipping", "Grow light starter"],
        itemsLeft: 120,
      },
      {
        id: "tier_lunar_200_community_champion",
        title: "Community Champion",
        amount: 200,
        description:
          "Help fund community demo farms and receive a kit for your neighborhood hub.",
        perks: ["Full kit", "Community impact updates", "Invite to demo day"],
        itemsLeft: 35,
      },
    ],
    createdAt: "2026-02-15T10:00:00.000Z",
  },
  {
    id: "arkive_offline_library_backpack_001",
    currencyCode: "USD",
    title: "Arkive: The Offline Library Backpack",
    tagline: "A backpack that carries thousands of stories—offline",
    story:
      "Arkive makes learning portable. Download a curated library once, then read anywhere—no internet required—powered by a lightweight e-paper display and sturdy design.",
    coverImage: "",
    category: "Education",
    goal: 30000,
    totalRaised: 11200,
    totalBackers: 1843,
    daysLeft: 14,
    isBookmarked: false,
    pledges: [
      {
        id: "tier_arkive_15_digital_supporter",
        title: "Digital Supporter",
        amount: 15,
        description:
          "Unlock early access to the Arkive library downloads and updates.",
        perks: [
          "Early library access",
          "Updates feed",
          "Reading recommendations",
        ],
        itemsLeft: null,
      },
      {
        id: "tier_arkive_60_backpack_edition",
        title: "Backpack Edition",
        amount: 60,
        description:
          "Get the Arkive Backpack Edition with the offline library preloaded.",
        perks: ["Backpack edition", "Offline library", "Device setup tutorial"],
        itemsLeft: 200,
      },
      {
        id: "tier_arkive_150_school_bundle_5",
        title: "School Bundle x5",
        amount: 150,
        description:
          "Bundle for classrooms: five backpacks + teacher pack and offline curriculum modules.",
        perks: ["5 backpacks", "Teacher pack", "Curriculum modules"],
        itemsLeft: 25,
      },
    ],
    createdAt: "2026-03-03T09:30:00.000Z",
  },
  {
    id: "solarpedal_ebike_africa_cities_001",
    title: "SolarPedal — E-Bike for African Cities",
    tagline: "Pedal-powered transport with solar recharge",
    story:
      "SolarPedal supports everyday mobility. The bike charges via solar and captures pedal power—so riders can travel farther, faster, and more affordably.",
    coverImage: "",
    category: "Technology",
    goal: 80000,
    totalRaised: 54300,
    totalBackers: 890,
    daysLeft: 9,
    isBookmarked: false,
    currencyCode: "USD",
    pledges: [
      {
        id: "tier_solar_50_early_rider",
        title: "Early Rider",
        amount: 50,
        description:
          "Get early access pricing and a limited edition SolarPedal accessory pack.",
        perks: ["Early access", "Accessory pack", "Road safety card"],
        itemsLeft: null,
      },
      {
        id: "tier_solar_120_full_kit_backer",
        title: "Full Kit Backer",
        amount: 120,
        description:
          "Reserve a complete e-bike kit with solar recharge module.",
        perks: ["Full kit", "Solar recharge module", "Assembly guide"],
        itemsLeft: 60,
      },
      {
        id: "tier_solar_300_fleet_founder_x3",
        title: "Fleet Founder x3 bikes",
        amount: 300,
        description:
          "Start a micro-fleet with three bikes and discounted replacement parts for 1 year.",
        perks: [
          "3 bikes",
          "Fleet setup assistance",
          "Parts discount (12 months)",
        ],
        itemsLeft: 12,
      },
    ],
    createdAt: "2026-01-28T14:20:00.000Z",
  },
];

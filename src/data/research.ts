import mosquito_net from "../assets/mosquito_net.jpeg";

export type ResearchType = "AI" | "PANDEMIC" | "NUCLEAR";

export type Research = {
  id: string;
  name: string;
  researchType: ResearchType;
  cost: number;
  flavourText: string;
  icon: string;
};

export const RESEARCH_UNLOCK_THRESHOLD = 1e4;

export const RESEARCHES: Research[] = [
  // AI
  {
    id: "safetyProtocols",
    name: "Baseline Safety Protocols",
    researchType: "AI",
    cost: 5e4,
    flavourText:
      "Misaligned superintelligence is not a science fiction scenario. Protocols give us time to get the harder problems right.",
    icon: mosquito_net,
  },
  {
    id: "killSwitches",
    name: "Kill Switches",
    researchType: "AI",
    cost: 1e5,
    flavourText:
      "If a system begins pursuing goals we did not intend, the ability to interrupt it may be our single most valuable asset.",
    icon: mosquito_net,
  },
  {
    id: "aiGovernance",
    name: "AI Governance",
    researchType: "AI",
    cost: 5e5,
    flavourText:
      "Uncoordinated AI development across competing actors raises the probability that someone cuts corners at exactly the wrong moment.",
    icon: mosquito_net,
  },
  {
    id: "explainableAI",
    name: "Explainable AI",
    researchType: "AI",
    cost: 1e6,
    flavourText:
      "A system whose reasoning we cannot inspect is a system whose misalignment we cannot detect.",
    icon: mosquito_net,
  },
  {
    id: "valueAlignment",
    name: "Human Value Alignment",
    researchType: "AI",
    cost: 5e6,
    flavourText:
      "AI will optimise for what we specify, not what we intend. Ensuring those specifications reliably reflect human values is key.",
    icon: mosquito_net,
  },

  // Pandemic
  {
    id: "detectionSurveillance",
    name: "Detection & Surveillance",
    researchType: "PANDEMIC",
    cost: 5e4,
    flavourText:
      "Engineered pathogens represent a catastrophic risk that grows as biotechnology becomes cheaper and more accessible. Early detection is the first line of defence against a threat that could end civilisation before most people know it has begun.",
    icon: mosquito_net,
  },
  {
    id: "rapidResponseTeams",
    name: "Rapid Response Teams",
    researchType: "PANDEMIC",
    cost: 1e5,
    flavourText:
      "The window in which a pandemic can be contained is measured in days. Well-equipped teams on standby is the difference between a local outbreak and a global pandemic.",
    icon: mosquito_net,
  },
  {
    id: "vaccinePlatforms",
    name: "Universal Vaccine Platforms",
    researchType: "PANDEMIC",
    cost: 5e5,
    flavourText:
      "A programmable vaccine platform collapses the time between pathogen sequencing and mass immunisation from years to weeks.",
    icon: mosquito_net,
  },
  {
    id: "globalHealthInfrastructure",
    name: "Global Health Infrastructure",
    researchType: "PANDEMIC",
    cost: 1e6,
    flavourText:
      "A pandemic does not respect borders. Any unmonitored reservoir is a potential source of civilisation-ending spread.",
    icon: mosquito_net,
  },
  {
    id: "pathogenEradication",
    name: "Pathogen Eradication",
    researchType: "PANDEMIC",
    cost: 5e6,
    flavourText:
      "Eradicating pathogen families which pose the highest extinction risk prevents a threat from ever emerging.",
    icon: mosquito_net,
  },

  {
    id: "nuclearWinterModelling",
    name: "Nuclear Winter Modelling",
    researchType: "NUCLEAR",
    cost: 5e4,
    flavourText:
      "Modelling and understanding a post-nuclear environment is the foundation of any meaningful preparation.",
    icon: mosquito_net,
  },
  {
    id: "seedVaultInfrastructure",
    name: "Seed Vault Infrastructure",
    researchType: "NUCLEAR",
    cost: 1e5,
    flavourText:
      "Crop preservation and diversity could be the difference between recovery and permanent agricultural collapse.",
    icon: mosquito_net,
  },
  {
    id: "blastShelterNetworks",
    name: "Blast Shelter Networks",
    researchType: "NUCLEAR",
    cost: 5e5,
    flavourText:
      "Most people killed in a nuclear exchange die not from the blasts but from the aftermath. Shelter infrastructure buys time for recovery.",
    icon: mosquito_net,
  },
  {
    id: "medicalTriageProtocols",
    name: "Mass Casualty Triage Protocols",
    researchType: "NUCLEAR",
    cost: 1e6,
    flavourText:
      "A post-exchange world has mass casualties and no functioning medical infrastructure. Triage research is unglamorous work that will saves lives at scale.",
    icon: mosquito_net,
  },
  {
    id: "undergroundFoodProduction",
    name: "Underground Food Production",
    researchType: "NUCLEAR",
    cost: 5e6,
    flavourText:
      "Fungiculture, mycoprotein and hydroponic systems housed miles below the surface. Not comfortable. But survivable. And sustainable even if the sun were to go out.",
    icon: mosquito_net,
  },
];

export type ResearchId = (typeof RESEARCHES)[number]["id"];

export const RESEARCH_TYPE_LABELS: Record<ResearchType, string> = {
  AI: "AI Safety",
  PANDEMIC: "Pandemic Prevention",
  NUCLEAR: "Nuclear Preparation",
};

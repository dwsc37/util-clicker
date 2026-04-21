import ai from "../assets/ai.png";
import pandemic from "../assets/pandemic.png";
import nuclear from "../assets/nuclear.png";

export type ResearchType = "AI" | "PANDEMIC" | "NUCLEAR";

export type Research = {
  id: string;
  name: string;
  researchType: ResearchType;
  cost: number;
  flavourText: string;
  icon: string;
};

export const RESEARCH_UNLOCK_THRESHOLD = 1e5;

export const RESEARCHES: Research[] = [
  // AI
  {
    id: "safetyProtocols",
    name: "Baseline Safety Protocols",
    researchType: "AI",
    cost: 5e5,
    flavourText:
      "Misaligned superintelligence is not a science fiction scenario. Protocols give us time to get the harder problems right.",
    icon: ai,
  },
  {
    id: "killSwitches",
    name: "Kill Switches",
    researchType: "AI",
    cost: 1e6,
    flavourText:
      "If a system begins pursuing goals we did not intend, the ability to interrupt it may be our single most valuable asset.",
    icon: ai,
  },
  {
    id: "aiGovernance",
    name: "AI Governance",
    researchType: "AI",
    cost: 5e6,
    flavourText:
      "Uncoordinated AI development across competing actors raises the probability that someone cuts corners at exactly the wrong moment.",
    icon: ai,
  },
  {
    id: "explainableAI",
    name: "Explainable AI",
    researchType: "AI",
    cost: 1e7,
    flavourText:
      "A system whose reasoning we cannot inspect is a system whose misalignment we cannot detect.",
    icon: ai,
  },
  {
    id: "valueAlignment",
    name: "Human Value Alignment",
    researchType: "AI",
    cost: 5e7,
    flavourText:
      "AI will optimise for what we specify, not what we intend. Ensuring those specifications reliably reflect human values is key.",
    icon: ai,
  },

  // Pandemic
  {
    id: "detectionSurveillance",
    name: "Detection & Surveillance",
    researchType: "PANDEMIC",
    cost: 5e5,
    flavourText:
      "Engineered pathogens represent a catastrophic risk that grows as biotechnology becomes cheaper and more accessible. Early detection is the first line of defence against a threat that could end civilisation before most people know it has begun.",
    icon: pandemic,
  },
  {
    id: "rapidResponseTeams",
    name: "Rapid Response Teams",
    researchType: "PANDEMIC",
    cost: 1e6,
    flavourText:
      "The window in which a pandemic can be contained is measured in days. Well-equipped teams on standby is the difference between a local outbreak and a global pandemic.",
    icon: pandemic,
  },
  {
    id: "vaccinePlatforms",
    name: "Universal Vaccine Platforms",
    researchType: "PANDEMIC",
    cost: 5e6,
    flavourText:
      "A programmable vaccine platform collapses the time between pathogen sequencing and mass immunisation from years to weeks.",
    icon: pandemic,
  },
  {
    id: "globalHealthInfrastructure",
    name: "Global Health Infrastructure",
    researchType: "PANDEMIC",
    cost: 1e7,
    flavourText:
      "A pandemic does not respect borders. Any unmonitored reservoir is a potential source of civilisation-ending spread.",
    icon: pandemic,
  },
  {
    id: "pathogenEradication",
    name: "Pathogen Eradication",
    researchType: "PANDEMIC",
    cost: 5e7,
    flavourText:
      "Eradicating pathogen families which pose the highest extinction risk prevents a threat from ever emerging.",
    icon: pandemic,
  },

  // Nuclear
  {
    id: "nuclearWinterModelling",
    name: "Nuclear Winter Modelling",
    researchType: "NUCLEAR",
    cost: 5e5,
    flavourText:
      "Modelling and understanding a post-nuclear environment is the foundation of any meaningful preparation.",
    icon: nuclear,
  },
  {
    id: "seedVaultInfrastructure",
    name: "Seed Vault Infrastructure",
    researchType: "NUCLEAR",
    cost: 1e6,
    flavourText:
      "Crop preservation and diversity could be the difference between recovery and permanent agricultural collapse.",
    icon: nuclear,
  },
  {
    id: "blastShelterNetworks",
    name: "Blast Shelter Networks",
    researchType: "NUCLEAR",
    cost: 5e6,
    flavourText:
      "Most people killed in a nuclear exchange die not from the blasts but from the aftermath. Shelter infrastructure buys time for recovery.",
    icon: nuclear,
  },
  {
    id: "medicalTriageProtocols",
    name: "Mass Casualty Triage Protocols",
    researchType: "NUCLEAR",
    cost: 1e7,
    flavourText:
      "A post-exchange world has mass casualties and no functioning medical infrastructure. Triage research is unglamorous work that will saves lives at scale.",
    icon: nuclear,
  },
  {
    id: "undergroundFoodProduction",
    name: "Underground Food Production",
    researchType: "NUCLEAR",
    cost: 5e7,
    flavourText:
      "Fungiculture, mycoprotein and hydroponic systems housed miles below the surface. Not comfortable. But survivable. And sustainable even if the sun were to go out.",
    icon: nuclear,
  },
];

export type ResearchId = (typeof RESEARCHES)[number]["id"];

export const RESEARCH_TYPE_LABELS: Record<ResearchType, string> = {
  AI: "AI Safety",
  PANDEMIC: "Pandemic Prevention",
  NUCLEAR: "Nuclear Preparation",
};

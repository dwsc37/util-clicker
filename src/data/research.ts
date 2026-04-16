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

  // Nuclear
  {
    id: "escalationDynamics",
    name: "Escalation Dynamics Research",
    researchType: "NUCLEAR",
    cost: 5e4,
    flavourText:
      "The path from a limited exchange to full-scale nuclear war is poorly understood. Modelling of escalation thresholds and decision-making is foundational to any risk reduction strategy.",
    icon: mosquito_net,
  },
  {
    id: "launchSafety",
    name: "Launch Safety Systems",
    researchType: "NUCLEAR",
    cost: 1e5,
    flavourText:
      "Hundreds of warheads stand ready to fire within minutes. Let's make sure they don't go off accidentally.",
    icon: mosquito_net,
  },
  {
    id: "nuclearWinterModelling",
    name: "Nuclear Winter Modelling",
    researchType: "NUCLEAR",
    cost: 5e5,
    flavourText:
      "Most estimates of nuclear risk rely on outdated climate models. Rigorous modelling of soot dispersal, agricultural collapse, and recovery timelines gives us a clearer picture of what we are actually trying to prevent.",
    icon: mosquito_net,
  },
  {
    id: "survivabilityResearch",
    name: "Fallout & Survivability Research",
    researchType: "NUCLEAR",
    cost: 1e6,
    flavourText:
      "Understanding which populations, geographies, and infrastructure systems are most resilient to nuclear effects lets us think clearly about what survival would actually require.",
    icon: mosquito_net,
  },
  {
    id: "recoveryPathways",
    name: "Civilisational Recovery Pathways",
    researchType: "NUCLEAR",
    cost: 5e6,
    flavourText:
      "A survivable nuclear exchange could lock humanity into a permanently reduced trajectory. Research into what institutions, knowledge bases, and resources need to be preserved or pre-positioned is key to retaining the capacity to flourish.",
    icon: mosquito_net,
  },
];

export type ResearchId = (typeof RESEARCHES)[number]["id"];

export const RESEARCH_TYPE_LABELS: Record<ResearchType, string> = {
  AI: "AI Safety",
  PANDEMIC: "Pandemic Prevention",
  NUCLEAR: "Nuclear Risk",
};

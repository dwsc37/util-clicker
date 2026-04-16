import type { GeneratorId } from "./generators";
import mosquito_net from "../assets/mosquito_net.jpeg";

export type EffectType = "UPS" | "COST";

export type Upgrade = {
  id: string;
  name: string;
  targetGeneratorId: GeneratorId;
  effect: EffectType;
  multiplier: number;
  cost: number;
  minOwned: number;
  flavourText: string;
  icon: string;
};

export const UPGRADES = [
  // Mosquito Net
  {
    id: "airShipping",
    name: "Ship by Air",
    targetGeneratorId: "mosquitoNet",
    effect: "UPS",
    multiplier: 2,
    cost: 50,
    minOwned: 1,
    flavourText:
      "Gets there in days instead of weeks. The carbon footprint is somebody else's problem.",
    icon: mosquito_net,
  },
  {
    id: "plasticNets",
    name: "Plastic Mosquito Nets",
    targetGeneratorId: "mosquitoNet",
    effect: "COST",
    multiplier: 0.8,
    cost: 200,
    minOwned: 5,
    flavourText: "Slightly worse for the ocean. But much cheaper to produce.",
    icon: mosquito_net,
  },

  // Soup Kitchen
  {
    id: "unpaidInterns",
    name: "Unpaid Interns",
    targetGeneratorId: "soupKitchen",
    effect: "UPS",
    multiplier: 2,
    cost: 500,
    minOwned: 1,
    flavourText: "We already pay them in exposure.",
    icon: mosquito_net,
  },
  {
    id: "processedIngredients",
    name: "Processed Ingredients",
    targetGeneratorId: "soupKitchen",
    effect: "COST",
    multiplier: 0.8,
    cost: 2000,
    minOwned: 5,
    flavourText:
      "It's technically still soup. They won't notice the difference.",
    icon: mosquito_net,
  },

  // Oil Palm Plantation
  {
    id: "newFertilizer",
    name: "New Fertilizer",
    targetGeneratorId: "oilPalm",
    effect: "UPS",
    multiplier: 2,
    cost: 5500,
    minOwned: 1,
    flavourText:
      "The yields are up. The river is a different colour. The fish are dead. These things are unrelated.",
    icon: mosquito_net,
  },
  {
    id: "controlledBurning",
    name: "Controlled Burning",
    targetGeneratorId: "oilPalm",
    effect: "COST",
    multiplier: 0.8,
    cost: 22000,
    minOwned: 5,
    flavourText: "The forest now comes down twice as fast. Burn baby burn!",
    icon: mosquito_net,
  },

  // Factory Farm
  {
    id: "gasChamber",
    name: "Pig Gas Chamber",
    targetGeneratorId: "factoryFarm",
    effect: "UPS",
    multiplier: 2,
    cost: 60000,
    minOwned: 1,
    flavourText: "This little piggy went to the gas chamber.",
    icon: mosquito_net,
  },
  {
    id: "dogMeat",
    name: "Dog Meat",
    targetGeneratorId: "factoryFarm",
    effect: "COST",
    multiplier: 0.8,
    cost: 240000,
    minOwned: 5,
    flavourText: "Sell dog meat as pork. I heard it tastes better anyway.",
    icon: mosquito_net,
  },

  // Prison Industrial Complex
  {
    id: "waterAgents",
    name: "WATER Agent Programme",
    targetGeneratorId: "prisonComplex",
    effect: "UPS",
    multiplier: 2,
    cost: 650000,
    minOwned: 1,
    flavourText:
      "WATER agents are securing and redirecting our non-citizen population to sustain essential workforce needs.",
    icon: mosquito_net,
  },
  {
    id: "reducedWelfare",
    name: "Prison Welfare Optimisation",
    targetGeneratorId: "prisonComplex",
    effect: "COST",
    multiplier: 0.8,
    cost: 2600000,
    minOwned: 5,
    flavourText:
      "Budget constraints have necessitated that nutritional and recreational provisions for inmates are reduced to the bare minimum.",
    icon: mosquito_net,
  },

  // Child Labour Agency
  {
    id: "childMines",
    name: "Junior Mining Programme",
    targetGeneratorId: "childLabour",
    effect: "UPS",
    multiplier: 2,
    cost: 7000000,
    minOwned: 1,
    flavourText: "The children yearn for the mines.",
    icon: mosquito_net,
  },
  {
    id: "inflationAdjustment",
    name: "Inflation Adjustment",
    targetGeneratorId: "childLabour",
    effect: "COST",
    multiplier: 0.8,
    cost: 28000000,
    minOwned: 5,
    flavourText:
      "Inflation is up! Do you want to pay the children less? It's not like they know anyway.",
    icon: mosquito_net,
  },

  // Human Experiment Lab
  {
    id: "acceleratedTrials",
    name: "Accelerated Trials",
    targetGeneratorId: "experimentLab",
    effect: "UPS",
    multiplier: 2,
    cost: 75000000,
    minOwned: 1,
    flavourText:
      "All that red tape introduces way too much delay. Surely we don't need that here.",
    icon: mosquito_net,
  },
  {
    id: "poorerPopulations",
    name: "Recruit from Poorer Populations",
    targetGeneratorId: "experimentLab",
    effect: "COST",
    multiplier: 0.8,
    cost: 300000000,
    minOwned: 5,
    flavourText: "They need those college education scholarships!",
    icon: mosquito_net,
  },
] as const;

export type UpgradeId = (typeof UPGRADES)[number]["id"];

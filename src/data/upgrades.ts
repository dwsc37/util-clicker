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
    id: "plasticNets",
    name: "Plastic Mosquito Nets",
    targetGeneratorId: "mosquitoNet",
    effect: "COST",
    multiplier: 0.85,
    cost: 50,
    minOwned: 1,
    flavourText:
      "Slightly worse for the environment, but the lives it will save matters more… right?",
    icon: mosquito_net,
  },
  {
    id: "airShipping",
    name: "Ship by Air",
    targetGeneratorId: "mosquitoNet",
    effect: "UPS",
    multiplier: 2,
    cost: 200,
    minOwned: 5,
    flavourText:
      "The longer these nets take to arrive, the more people die from malaria. Surely it's worth the extra fuel.",
    icon: mosquito_net,
  },

  // Soup Kitchen
  {
    id: "processedIngredients",
    name: "Processed Ingredients",
    targetGeneratorId: "soupKitchen",
    effect: "COST",
    multiplier: 0.8,
    cost: 500,
    minOwned: 1,
    flavourText: "It's cheaper and they won't notice the difference.",
    icon: mosquito_net,
  },
  {
    id: "unpaidInterns",
    name: "Unpaid Interns",
    targetGeneratorId: "soupKitchen",
    effect: "UPS",
    multiplier: 2,
    cost: 2000,
    minOwned: 5,
    flavourText: "We already pay them in exposure.",
    icon: mosquito_net,
  },

  // Oil Palm Plantation
  {
    id: "controlledBurning",
    name: "Controlled Burning",
    targetGeneratorId: "oilPalm",
    effect: "COST",
    multiplier: 0.8,
    cost: 5000,
    minOwned: 1,
    flavourText:
      "A little bit of haze is nothing now that we can clear a forest twice as fast. Burn baby burn!",
    icon: mosquito_net,
  },
  {
    id: "newFertilizer",
    name: "New Fertilizer",
    targetGeneratorId: "oilPalm",
    effect: "UPS",
    multiplier: 2,
    cost: 20000,
    minOwned: 5,
    flavourText:
      "Makes the trees grow twice as fast! Don't mind the dead fish.",
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
    multiplier: 0.75,
    cost: 200000,
    minOwned: 5,
    flavourText: "Sell dog meat as pork. I heard it tastes better anyway.",
    icon: mosquito_net,
  },

  // Prison Indusrial Complex
  {
    id: "waterAgents",
    name: "Recruit WATER Agents",
    targetGeneratorId: "prisonComplex",
    effect: "UPS",
    multiplier: 2,
    cost: 700000,
    minOwned: 1,
    flavourText:
      "WATER (Wash Away The Evil Races) Agents now forcefully incarcerate immigrants to increase prison workforce.",
    icon: mosquito_net,
  },

  // Child Labour Agency
  {
    id: "cutWages",
    name: "Cut Wages",
    targetGeneratorId: "childLabour",
    effect: "COST",
    multiplier: 0.75,
    cost: 7000000,
    minOwned: 1,
    flavourText:
      "Inflation is up! Do you want to pay the children less? It's not like they know anyway.",
    icon: mosquito_net,
  },
  {
    id: "childMines",
    name: "The Children Yearn for the Mines",
    targetGeneratorId: "childLabour",
    effect: "UPS",
    multiplier: 2,
    cost: 30000000,
    minOwned: 5,
    flavourText:
      "Children can now work in gold and diamond mines. More precious metals for everyone!",
    icon: mosquito_net,
  },

  // Human Experimentation Lab
] as const;

export type UpgradeId = (typeof UPGRADES)[number]["id"];

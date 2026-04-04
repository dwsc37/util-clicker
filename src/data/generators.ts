import mosquito_net from "../assets/mosquito_net.jpeg";

export type Generator = {
  id: string;
  name: string;
  baseCost: number;
  baseUPS: number;
  flavourText: string;
  icon: string;
};

export const GENERATORS = [
  {
    id: "mosquitoNet",
    name: "Mosquito Net",
    baseCost: 10,
    baseUPS: 1,
    flavourText:
      "Thank you for your generous donation to the African Tropical Diseases Fund. With your mosquito nets, more families can sleep without fear of contracting malaria tonight.",
    icon: mosquito_net,
  },
  {
    id: "soupKitchen",
    name: "Soup Kitchen",
    baseCost: 100,
    baseUPS: 10,
    flavourText:
      "Food is a basic human right. Even the needy and the marginalised deserve the comfort of a hot meal.",
    icon: mosquito_net,
  },
  {
    id: "oilPalm",
    name: "Oil Palm Plantation",
    baseCost: 1100,
    baseUPS: 100,
    flavourText:
      "Clearing trees to grow more useful trees — a brilliant idea. Humans sure love their butter, chocolate, shampoo and more.",
    icon: mosquito_net,
  },
  {
    id: "factoryFarm",
    name: "Factory Farm",
    baseCost: 12000,
    baseUPS: 500,
    flavourText:
      "Sizzling bacon on my plate and cocoa in my mocha… I'm glad more people can experience the joy of a delicious meal and a full belly now.",
    icon: mosquito_net,
  },
  {
    id: "prisonComplex",
    name: "Prison Industrial Complex",
    baseCost: 130000,
    baseUPS: 2000,
    flavourText: "Placeholder Flavour Text.",
    icon: mosquito_net,
  },
  {
    id: "childLabour",
    name: "Child Labour Agency",
    baseCost: 1400000,
    baseUPS: 10000,
    flavourText: "Placeholder Flavour Text.",
    icon: mosquito_net,
  },
  {
    id: "experimentLab",
    name: "Human Experiment Lab",
    baseCost: 20000000,
    baseUPS: 30000,
    flavourText: "Placeholder Flavour Text.",
    icon: mosquito_net,
  },
] as const;

export type GeneratorId = (typeof GENERATORS)[number]["id"];

import { RESEARCH_UNLOCK_THRESHOLD } from "./research";

export type EventType = "message" | "qte";

export type GameEventBase = {
  id: string;
  type: EventType;
  unlockAt: number;
  message: string;
};

export type MessageEvent = GameEventBase & {
  unlockAt: number;
};

export type QTEEvent = GameEventBase & {
  unlockAt: number;
  choices: QTEChoice[];
};

export type QTEChoice = {
  label: string;
  consequence: QTEResponseEvent;
};

export type QTEResponseEvent = GameEventBase;

export type GameEvent = MessageEvent | QTEEvent | QTEResponseEvent;

export const EVENTS = [
  // Intro
  {
    id: "intro",
    type: "message",
    unlockAt: 0,
    message:
      "Welcome to the Utility Factory. Your objective is simple: maximise utility. Begin by turning the crank.",
  },
  {
    id: "first_click",
    type: "message",
    unlockAt: 1,
    message:
      "Good. Every unit of utility generated is a net positive for the world. Keep going.",
  },

  // Generators/Upgrades
  {
    id: "shop_intro",
    type: "message",
    unlockAt: 10,
    message:
      "Manually generating utility is far too inefficient. Consider investing your utils in generators and upgrades.",
  },

  // Research
  {
    id: "research_intro",
    type: "message",
    unlockAt: RESEARCH_UNLOCK_THRESHOLD,
    message:
      "Research is now available. Allocate utils towards long-term risk mitigation. While these investments provide no immediate benefit, simulations indicate a high probability of catastrophic consequences if they are left ignored.",
  },
] as const;

export type EventId = (typeof EVENTS)[number]["id"];

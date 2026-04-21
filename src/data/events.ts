import type { GameState } from "../store/reducer";
import { formatUtils } from "../utils/format";
import {
  RESEARCH_UNLOCK_THRESHOLD,
  RESEARCHES,
  type ResearchType,
} from "./research";

export type EventType = "message" | "qte";

export type GameEventBase = {
  id: string;
  type: EventType;
  unlockAt: number;
  message: string | ((state: GameState) => string);
  gameEffect?: (state: GameState) => GameState;
  condition?: (state: GameState) => boolean;
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

export function resolveMessage(
  message: string | ((state: GameState) => string),
  state: GameState,
): string {
  return typeof message === "function" ? message(state) : message;
}

// Drowning Child QTE series

const DROWNING_CHILD_COST_1 = 40;
const DROWNING_CHILD_COST_2 = 4_000;
const DROWNING_CHILD_COST_3 = 400_000;
const DROWNING_CHILD_COST_4 = 40_000_000;

const drowningChild1: QTEEvent = {
  id: "drowning_child_1",
  type: "qte",
  unlockAt: 50,
  message:
    "A child is drowning in a shallow pond nearby. You could wade in and save them. It would cost you next to nothing. Or perhaps your utils are better allocated elsewhere. What do you do?",
  choices: [
    {
      label: `Save the child (−${formatUtils(DROWNING_CHILD_COST_1)} utils)`,
      consequence: {
        id: "drowning_child_1_save",
        type: "message",
        unlockAt: 0,
        message: "You wade into the pond and save the child.",
        gameEffect: (state) => ({
          ...state,
          utils: state.utils - DROWNING_CHILD_COST_1,
        }),
      },
    },
    {
      label: "Ignore it",
      consequence: {
        id: "drowning_child_1_ignore",
        type: "message",
        unlockAt: 0,
        message:
          "You ignore the child. The splashing fades. Utility maximisation requires difficult trade-offs, you remind yourself.",
      },
    },
  ],
};

const drowningChild2: QTEEvent = {
  id: "drowning_child_2",
  type: "qte",
  unlockAt: 5_000,
  condition: (state) => state.triggeredEvents["drowning_child_1_save"] === true,
  message:
    "A child is drowning in a pond again. Remarkably similar circumstances. The cost of intervention has risen. Your time is worth more now. What do you do?",
  choices: [
    {
      label: `Save the child (−${formatUtils(DROWNING_CHILD_COST_2)} utils)`,
      consequence: {
        id: "drowning_child_2_save",
        type: "message",
        unlockAt: 0,
        message: "You save the child. They look identical to the last one.",
        gameEffect: (state) => ({
          ...state,
          utils: state.utils - DROWNING_CHILD_COST_2,
        }),
      },
    },
    {
      label: "Ignore it",
      consequence: {
        id: "drowning_child_2_ignore",
        type: "message",
        unlockAt: 0,
        message:
          "You ignore the child. The splashing fades. Utility maximisation requires difficult trade-offs, you remind yourself.",
      },
    },
  ],
};

const drowningChild3: QTEEvent = {
  id: "drowning_child_3",
  type: "qte",
  unlockAt: 500_000,
  condition: (state) => state.triggeredEvents["drowning_child_2_save"] === true,
  message:
    "There is a child drowning in the pond. Again. You know the pond well now. At this scale of operations, the disruption cost is significant. And yet — it is a child. It is always a child. What do you do?",
  choices: [
    {
      label: `Save the child (−${formatUtils(DROWNING_CHILD_COST_3)} utils)`,
      consequence: {
        id: "drowning_child_3_save",
        type: "message",
        unlockAt: 0,
        message:
          "Yet again, you save the child. You wonder how many ponds there are in the world.",
        gameEffect: (state) => ({
          ...state,
          utils: state.utils - DROWNING_CHILD_COST_3,
        }),
      },
    },
    {
      label: "Ignore it",
      consequence: {
        id: "drowning_child_3_ignore",
        type: "message",
        unlockAt: 0,
        message:
          "You ignore the child. The splashing fades. Utility maximisation requires difficult trade-offs, you remind yourself.",
      },
    },
  ],
};

const drowningChild4: QTEEvent = {
  id: "drowning_child_4",
  type: "qte",
  unlockAt: 50_000_000,
  condition: (state) => state.triggeredEvents["drowning_child_3_save"] === true,
  message:
    "The pond is still there. The child is still there. You have saved three children from this pond already. Or perhaps it is the same child, or no child at all, and the pond is simply a test you keep administering to yourself. The cost now is larger than ever before. You go anyway. Don't you?",
  choices: [
    {
      label: `Save the child (−${formatUtils(DROWNING_CHILD_COST_4)} utils)`,
      consequence: {
        id: "drowning_child_4_save",
        type: "message",
        unlockAt: 0,
        message:
          "You save the child. You don't know their name. You never did.",
        gameEffect: (state) => ({
          ...state,
          utils: state.utils - DROWNING_CHILD_COST_4,
        }),
      },
    },
    {
      label: "Ignore it",
      consequence: {
        id: "drowning_child_4_ignore",
        type: "message",
        unlockAt: 0,
        message:
          "You ignore the child. The splashing fades. Utility maximisation requires difficult trade-offs, you remind yourself.",
      },
    },
  ],
};

function countResearchByType(state: GameState, type: ResearchType): number {
  return RESEARCHES.filter(
    (r) => r.researchType === type && state.purchasedResearches[r.id],
  ).length;
}

// Penalty scaling: index = number of researches purchased (0–5)
// AI: percentage of utils lost
const AI_PENALTIES = [0.95, 0.75, 0.55, 0.35, 0.15, 0];
// Pandemic/Nuclear: fraction of each generator count lost
const PANDEMIC_PENALTIES = [0.95, 0.75, 0.55, 0.35, 0.15, 0];
const NUCLEAR_PENALTIES = [0.95, 0.75, 0.55, 0.35, 0.15, 0];

function applyGeneratorPenalty(state: GameState, fraction: number): GameState {
  const newOwned: Record<string, number> = {};
  for (const [id, count] of Object.entries(state.ownedGenerators)) {
    newOwned[id] = Math.floor(count * (1 - fraction));
  }
  return { ...state, ownedGenerators: newOwned };
}

const researchPenaltyAI: MessageEvent = {
  id: "research_penalty_ai",
  type: "message",
  unlockAt: 2e8,
  message: (state: GameState) => {
    const count = countResearchByType(state, "AI");
    const msgs = [
      "SYSTEM ALERT: A rogue AI achieved broad access to networked infrastructure. By the time it was manually terminated, it had siphoned 95% of your liquid utils. Your AI safety research investment: zero.",
      "SYSTEM ALERT: A rogue AI infiltrated networked infrastructure. Your minimal safety investment slowed detection but could not prevent significant damage. 75% of your utils were siphoned before containment.",
      "SYSTEM ALERT: A rogue AI achieved partial access to networked infrastructure. Your safety systems eventually contained it. 55% of utils were lost in the window before termination.",
      "SYSTEM ALERT: A rogue AI was detected and contained before reaching critical infrastructure. 35% of utils were siphoned before termination. Your research worked — not perfectly, but well enough.",
      "SYSTEM ALERT: Your AI safety systems flagged and isolated a rogue AI before it could cause significant damage. 15% of utils were lost in the brief window before containment.",
      "SYSTEM ALERT: An infiltration attempt by a rogue AI was detected and terminated within minutes. Your AI safety research meant the process never reached a stage where it could cause meaningful harm. 5% of utils lost.",
    ];
    return msgs[Math.min(count, msgs.length - 1)];
  },
  gameEffect: (state: GameState) => {
    const count = countResearchByType(state, "AI");
    const penalty = AI_PENALTIES[Math.min(count, AI_PENALTIES.length - 1)];
    return { ...state, utils: Math.floor(state.utils * (1 - penalty)) };
  },
};

const researchPenaltyPandemic: MessageEvent = {
  id: "research_penalty_pandemic",
  type: "message",
  unlockAt: 3e8,
  message: (state: GameState) => {
    const count = countResearchByType(state, "PANDEMIC");
    const msgs = [
      "HEALTH EMERGENCY: A novel pathogen is spreading exponentially across your production regions. Your pandemic preparedness investment: zero. Workers are dying or fleeing. 95% of your generators are offline.",
      "HEALTH EMERGENCY: A severe pandemic has taken hold. Your minimal pandemic preparedness investment provided almost no buffer. 75% of your generator capacity is offline as workforces collapse across every sector.",
      "HEALTH ALERT: A dangerous pathogen is spreading rapidly. Your partial preparedness measures have slowed transmission in some regions. 55% of your generators are offline.",
      "HEALTH ALERT: An outbreak has been detected and your response infrastructure has activated. Containment is progressing. 35% of your generators are temporarily offline pending workforce recovery.",
      "HEALTH NOTICE: A new pathogen was identified early by your surveillance network. Rapid response protocols limited spread significantly. 15% of your generators face temporary workforce disruption.",
      "HEALTH NOTICE: A potential pandemic pathogen was flagged and eradicated at source. No meaningful disruption to operations. Your research investment functioned exactly as intended.",
    ];
    return msgs[Math.min(count, msgs.length - 1)];
  },
  gameEffect: (state: GameState) => {
    const count = countResearchByType(state, "PANDEMIC");
    const penalty =
      PANDEMIC_PENALTIES[Math.min(count, PANDEMIC_PENALTIES.length - 1)];
    return applyGeneratorPenalty(state, penalty);
  },
};

const researchPenaltyNuclear: MessageEvent = {
  id: "research_penalty_nuclear",
  type: "message",
  unlockAt: 4e8,
  message: (state: GameState) => {
    const count = countResearchByType(state, "NUCLEAR");
    const msgs = [
      "NUCLEAR EVENT: A limited nuclear exchange has occurred. Your nuclear prepartion research investment: zero. A nuclear winter has crippled your operations. 95% of your physical infrastructure is offline.",
      "NUCLEAR EVENT: A limited nuclear exchange has occurred. Your nuclear preparation research investment provided little benefit. Nuclear winter conditions are developing. 75% of your generators are offline.",
      "NUCLEAR EVENT: A limited nuclear exchange has occurred. Some nuclear prepation research investment was in place. It is not enough, but it is something. 55% of your generators are offline.",
      "NUCLEAR EVENT: A limited nuclear exchange has occurred. Your nuclear prepartion research investment has paid off. Seed vaults are being accessed, shelter networks are providing refuge. 35% of your generators are offline.",
      "NUCLEAR EVENT: A limited nuclear exchange has occurred. Your investment in nuclear preparation research has significantly reduced the impact. Food production has been partially maintained. 15% of your generators are offline.",
      "NUCLEAR EVENT: A limited nuclear exchange has occurred. Your comprehensive nuclear preparation research has positioned your operation to weather the aftermath. 5% of generators offline in directly affected zones. You prepared for the worst. It arrived.",
    ];
    return msgs[Math.min(count, msgs.length - 1)];
  },
  gameEffect: (state: GameState) => {
    const count = countResearchByType(state, "NUCLEAR");
    const penalty =
      NUCLEAR_PENALTIES[Math.min(count, NUCLEAR_PENALTIES.length - 1)];
    return applyGeneratorPenalty(state, penalty);
  },
};

// Generator Ethical Dilemma QTEs
// TO BE ADDED

export const EVENTS: GameEvent[] = [
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

  // Drowning child series
  drowningChild1,
  drowningChild2,
  drowningChild3,
  drowningChild4,

  // Research penalty events
  researchPenaltyAI,
  researchPenaltyPandemic,
  researchPenaltyNuclear,

  // Generator dilemmas
];

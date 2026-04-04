import { GENERATORS, type Generator } from "../data/generators";
import { UPGRADES, type Upgrade } from "../data/upgrades";
import { EVENTS, type GameEvent, type QTEEvent } from "../data/events";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TerminalMessage = {
  id: string;
  text: string;
  timestamp: number;
  isNew: boolean;
};

export type GameState = {
  utils: number;
  totalUtilsEarned: number;
  utilsPerClick: number;
  utilsPerSecond: number;
  ownedGenerators: Record<string, number>;
  generatorEarnings: Record<string, number>;
  purchasedUpgrades: Record<string, true>;
  terminalMessages: TerminalMessage[];
  triggeredEvents: Record<string, true>;
  activeQTE: QTEEvent | null;
};

export type GameAction =
  | { type: "CLICK" }
  | { type: "TICK"; payload: { delta: number } }
  | { type: "BUY_GENERATOR"; payload: { generatorId: string } }
  | { type: "BUY_UPGRADE"; payload: { upgradeId: string } }
  | { type: "MARK_MESSAGE_READ"; payload: { messageId: string } }
  | { type: "RESOLVE_QTE"; payload: { choiceIndex: 0 | 1 } };

// ---------------------------------------------------------------------------
// Action Constants
// ---------------------------------------------------------------------------

export const ACTIONS = {
  CLICK: "CLICK",
  TICK: "TICK",
  BUY_GENERATOR: "BUY_GENERATOR",
  BUY_UPGRADE: "BUY_UPGRADE",
  MARK_MESSAGE_READ: "MARK_MESSAGE_READ",
  RESOLVE_QTE: "RESOLVE_QTE",
} as const;

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------

export function buildInitialState(): GameState {
  const ownedGenerators: Record<string, number> = {};
  GENERATORS.forEach((g) => {
    ownedGenerators[g.id] = 0;
  });

  return {
    utils: 0,
    totalUtilsEarned: 0,
    utilsPerClick: 1,
    utilsPerSecond: 0,
    ownedGenerators,
    generatorEarnings: {},
    purchasedUpgrades: {},
    terminalMessages: [],
    triggeredEvents: {},
    activeQTE: null,
  };
}

// ---------------------------------------------------------------------------
// Cost and Util helpers
// ---------------------------------------------------------------------------

export function getGeneratorCost(
  generatorId: string,
  owned: number,
  purchasedUpgrades: Record<string, true>,
): number {
  const gen = GENERATORS.find((g) => g.id === generatorId);
  if (!gen) return Infinity;

  const costMultiplier = UPGRADES.filter(
    (u) =>
      u.targetGeneratorId === generatorId &&
      u.effect === "COST" &&
      purchasedUpgrades[u.id],
  ).reduce((acc, u) => acc * u.multiplier, 1);

  return Math.floor(gen.baseCost * Math.pow(1.15, owned) * costMultiplier);
}

export function getGeneratorUPS(
  generatorId: string,
  owned: number,
  purchasedUpgrades: Record<string, true>,
): number {
  if (owned === 0) return 0;
  const gen = GENERATORS.find((g) => g.id === generatorId);
  if (!gen) return 0;

  const upsMultiplier = UPGRADES.filter(
    (u) =>
      u.targetGeneratorId === generatorId &&
      u.effect === "UPS" &&
      purchasedUpgrades[u.id],
  ).reduce((acc, u) => acc * u.multiplier, 1);

  return gen.baseUPS * owned * upsMultiplier;
}

export function computeTotalUPS(
  ownedGenerators: Record<string, number>,
  purchasedUpgrades: Record<string, true>,
): number {
  return Object.entries(ownedGenerators).reduce((total, [id, owned]) => {
    return total + getGeneratorUPS(id, owned, purchasedUpgrades);
  }, 0);
}

// ---------------------------------------------------------------------------
// Event and Message Handling
// ---------------------------------------------------------------------------

function makeEventMessage(event: GameEvent): TerminalMessage {
  return {
    id: event.id,
    text: event.message,
    timestamp: Date.now(),
    isNew: true,
  };
}

function makeGeneratorMessage(generator: Generator): TerminalMessage {
  return {
    id: generator.id,
    text: generator.flavourText,
    timestamp: Date.now(),
    isNew: true,
  };
}

function makeUpgradeMessage(upgrade: Upgrade): TerminalMessage {
  return {
    id: upgrade.id,
    text: upgrade.flavourText,
    timestamp: Date.now(),
    isNew: true,
  };
}

function getPendingEvents(state: GameState): GameEvent[] {
  return EVENTS.filter(
    (e) => !state.triggeredEvents[e.id] && state.totalUtilsEarned >= e.unlockAt,
  ).sort((a, b) => a.unlockAt - b.unlockAt) as GameEvent[];
}

function addMessages(state: GameState): GameState {
  let current = state;

  if (current.activeQTE !== null) return current;

  const pending = getPendingEvents(state);

  for (const event of pending) {
    const newTriggered: Record<string, true> = {
      ...current.triggeredEvents,
      [event.id]: true,
    };

    if (event.type === "message") {
      current = {
        ...current,
        terminalMessages: [
          ...current.terminalMessages,
          makeEventMessage(event),
        ],
        triggeredEvents: newTriggered,
      };
    } else {
      current = {
        ...current,
        terminalMessages: [
          ...current.terminalMessages,
          makeEventMessage(event),
        ],
        triggeredEvents: newTriggered,
        activeQTE: event as QTEEvent,
      };
      return current;
    }
  }

  for (const generator of GENERATORS) {
    if (current.terminalMessages.find((m) => m.id === generator.id)) continue;
    if (current.ownedGenerators[generator.id] === 0) continue;
    current = {
      ...current,
      terminalMessages: [
        ...current.terminalMessages,
        makeGeneratorMessage(generator),
      ],
    };
  }

  for (const upgrade of UPGRADES) {
    if (current.terminalMessages.find((m) => m.id === upgrade.id)) continue;
    if (!current.purchasedUpgrades[upgrade.id]) continue;
    current = {
      ...current,
      terminalMessages: [
        ...current.terminalMessages,
        makeUpgradeMessage(upgrade),
      ],
    };
  }

  return current;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case ACTIONS.CLICK: {
      const gained = state.utilsPerClick;
      const next: GameState = {
        ...state,
        utils: state.utils + gained,
        totalUtilsEarned: state.totalUtilsEarned + gained,
      };
      return addMessages(next);
    }

    case ACTIONS.TICK: {
      const newEarnings = { ...state.generatorEarnings };
      let gained = 0;
      Object.entries(state.ownedGenerators).forEach(([id, owned]) => {
        if (owned > 0) {
          const earned =
            getGeneratorUPS(id, owned, state.purchasedUpgrades) *
            action.payload.delta;
          newEarnings[id] = (newEarnings[id] ?? 0) + earned;
          gained += earned;
        }
      });
      const next: GameState = {
        ...state,
        utils: state.utils + gained,
        totalUtilsEarned: state.totalUtilsEarned + gained,
        generatorEarnings: newEarnings,
      };
      return addMessages(next);
    }

    case ACTIONS.BUY_GENERATOR: {
      const { generatorId } = action.payload;
      const currentOwned = state.ownedGenerators[generatorId] ?? 0;
      const cost = getGeneratorCost(
        generatorId,
        currentOwned,
        state.purchasedUpgrades,
      );

      if (state.utils < cost) return state;

      const newOwned: Record<string, number> = {
        ...state.ownedGenerators,
        [generatorId]: currentOwned + 1,
      };

      const next: GameState = {
        ...state,
        utils: state.utils - cost,
        ownedGenerators: newOwned,
        utilsPerSecond: computeTotalUPS(newOwned, state.purchasedUpgrades),
      };

      return addMessages(next);
    }

    case ACTIONS.BUY_UPGRADE: {
      const { upgradeId } = action.payload;
      const upgrade = UPGRADES.find((u) => u.id === upgradeId);
      if (!upgrade) return state;
      if (state.purchasedUpgrades[upgradeId]) return state;
      if (state.utils < upgrade.cost) return state;

      const newPurchased: Record<string, true> = {
        ...state.purchasedUpgrades,
        [upgradeId]: true,
      };

      const next: GameState = {
        ...state,
        utils: state.utils - upgrade.cost,
        purchasedUpgrades: newPurchased,
        utilsPerSecond: computeTotalUPS(state.ownedGenerators, newPurchased),
      };

      return addMessages(next);
    }

    case ACTIONS.MARK_MESSAGE_READ: {
      const { messageId } = action.payload;
      return {
        ...state,
        terminalMessages: state.terminalMessages.map((m) =>
          m.id === messageId ? { ...m, isNew: false } : m,
        ),
      };
    }

    case ACTIONS.RESOLVE_QTE: {
      if (!state.activeQTE) return state;
      const { choiceIndex } = action.payload;
      const choice = state.activeQTE.choices[choiceIndex];

      const consequenceMessage = makeEventMessage(choice.consequence);

      const next: GameState = {
        ...state,
        activeQTE: null,
        terminalMessages: [...state.terminalMessages, consequenceMessage],
      };

      return addMessages(next);
    }
  }
}

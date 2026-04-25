import { GENERATORS, type Generator } from "../data/generators";
import { UPGRADES, type Upgrade } from "../data/upgrades";
import {
  EVENTS,
  type GameEvent,
  type QTEChoice,
  type QTEEvent,
  resolveMessage,
} from "../data/events";
import { RESEARCHES, type Research } from "../data/research";
import { computePrestigeMultiplier } from "../data/prestige";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TerminalMessage = {
  id: string;
  text: string;
  timestamp: number;
  qteChoices?: QTEChoice[];
};

export type GameState = {
  gameStarted: boolean;
  utils: number;
  totalUtilsEarned: number;
  lifetimeUtilsEarned: number;
  prestigeCount: number;
  prestigeMultiplier: number;
  utilsPerClick: number;
  utilsPerSecond: number;
  ownedGenerators: Record<string, number>;
  generatorEarnings: Record<string, number>;
  purchasedUpgrades: Record<string, true>;
  purchasedResearches: Record<string, true>;
  terminalMessages: TerminalMessage[];
  triggeredEvents: Record<string, true>;
  activeMessage: TerminalMessage | null;
};

export type GameAction =
  | { type: "START" }
  | { type: "CLICK" }
  | { type: "TICK"; payload: { delta: number } }
  | { type: "BUY_GENERATOR"; payload: { generatorId: string } }
  | { type: "BUY_UPGRADE"; payload: { upgradeId: string } }
  | { type: "BUY_RESEARCH"; payload: { researchId: string } }
  | { type: "ACKNOWLEDGE_MESSAGE" }
  | { type: "RESOLVE_QTE"; payload: { choiceIndex: 0 | 1 } }
  | { type: "PRESTIGE" };

// ---------------------------------------------------------------------------
// Action Constants
// ---------------------------------------------------------------------------

export const ACTIONS = {
  START: "START",
  CLICK: "CLICK",
  TICK: "TICK",
  BUY_GENERATOR: "BUY_GENERATOR",
  BUY_UPGRADE: "BUY_UPGRADE",
  BUY_RESEARCH: "BUY_RESEARCH",
  ACKNOWLEDGE_MESSAGE: "ACKNOWLEDGE_MESSAGE",
  RESOLVE_QTE: "RESOLVE_QTE",
  PRESTIGE: "PRESTIGE",
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
    gameStarted: false,
    utils: 0,
    totalUtilsEarned: 0,
    lifetimeUtilsEarned: 0,
    prestigeCount: 0,
    prestigeMultiplier: 1,
    utilsPerClick: 1,
    utilsPerSecond: 0,
    ownedGenerators,
    generatorEarnings: {},
    purchasedUpgrades: {},
    purchasedResearches: {},
    terminalMessages: [],
    triggeredEvents: {},
    activeMessage: null,
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
  prestigeMultiplier: number,
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

  return gen.baseUPS * owned * upsMultiplier * prestigeMultiplier;
}

export function computeTotalUPS(
  ownedGenerators: Record<string, number>,
  purchasedUpgrades: Record<string, true>,
  prestigeMultiplier: number,
): number {
  return Object.entries(ownedGenerators).reduce(
    (total, [id, owned]) =>
      total + getGeneratorUPS(id, owned, purchasedUpgrades, prestigeMultiplier),
    0,
  );
}

// ---------------------------------------------------------------------------
// Event and Message Handling
// ---------------------------------------------------------------------------

function makeEventMessage(event: GameEvent, state: GameState): TerminalMessage {
  const text = resolveMessage(event.message, state);

  if (event.type === "qte") {
    return {
      id: event.id,
      text,
      timestamp: Date.now(),
      qteChoices: (event as QTEEvent).choices,
    };
  }

  return {
    id: event.id,
    text,
    timestamp: Date.now(),
  };
}

function makePurchaseMessage(
  purchased: Generator | Upgrade | Research,
): TerminalMessage {
  return {
    id: purchased.id,
    text: purchased.flavourText,
    timestamp: Date.now(),
  };
}

function getPendingEvents(state: GameState): GameEvent[] {
  return EVENTS.filter(
    (e) =>
      !state.triggeredEvents[e.id] &&
      state.totalUtilsEarned >= e.unlockAt &&
      (e.condition == null || e.condition(state)),
  ).sort((a, b) => a.unlockAt - b.unlockAt) as GameEvent[];
}

function triggerMessage(state: GameState): GameState {
  let current = state;

  if (current.activeMessage !== null) return current;

  for (const generator of GENERATORS) {
    if (current.terminalMessages.find((m) => m.id === generator.id)) continue;
    if (current.ownedGenerators[generator.id] === 0) continue;
    const message = makePurchaseMessage(generator);
    current = {
      ...current,
      terminalMessages: [...current.terminalMessages, message],
      activeMessage: message,
    };
    return current;
  }

  for (const upgrade of UPGRADES) {
    if (current.terminalMessages.find((m) => m.id === upgrade.id)) continue;
    if (!current.purchasedUpgrades[upgrade.id]) continue;
    const message = makePurchaseMessage(upgrade);
    current = {
      ...current,
      terminalMessages: [...current.terminalMessages, message],
      activeMessage: message,
    };
    return current;
  }

  for (const research of RESEARCHES) {
    if (current.terminalMessages.find((m) => m.id === research.id)) continue;
    if (!current.purchasedResearches[research.id]) continue;
    const message = makePurchaseMessage(research);
    current = {
      ...current,
      terminalMessages: [...current.terminalMessages, message],
      activeMessage: message,
    };
    return current;
  }

  const pending = getPendingEvents(state);

  for (const event of pending) {
    const stateAfterEffect = event.gameEffect
      ? event.gameEffect(current)
      : current;
    const newTriggered: Record<string, true> = {
      ...stateAfterEffect.triggeredEvents,
      [event.id]: true,
    };

    const message = makeEventMessage(event, stateAfterEffect);
    current = {
      ...stateAfterEffect,
      terminalMessages: [...stateAfterEffect.terminalMessages, message],
      triggeredEvents: newTriggered,
      activeMessage: message,
    };
    return current;
  }

  return current;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (!state.gameStarted && action.type !== ACTIONS.START) {
    return state;
  }
  switch (action.type) {
    case ACTIONS.START: {
      return {
        ...state,
        gameStarted: true,
      };
    }

    case ACTIONS.CLICK: {
      const gained = state.utilsPerClick;
      const next: GameState = {
        ...state,
        utils: state.utils + gained,
        totalUtilsEarned: state.totalUtilsEarned + gained,
        lifetimeUtilsEarned: state.lifetimeUtilsEarned + gained,
      };
      return triggerMessage(next);
    }

    case ACTIONS.TICK: {
      const newEarnings = { ...state.generatorEarnings };
      let gained = 0;
      Object.entries(state.ownedGenerators).forEach(([id, owned]) => {
        if (owned > 0) {
          const earned =
            getGeneratorUPS(
              id,
              owned,
              state.purchasedUpgrades,
              state.prestigeMultiplier,
            ) * action.payload.delta;
          newEarnings[id] = (newEarnings[id] ?? 0) + earned;
          gained += earned;
        }
      });
      const next: GameState = {
        ...state,
        utils: state.utils + gained,
        totalUtilsEarned: state.totalUtilsEarned + gained,
        lifetimeUtilsEarned: state.lifetimeUtilsEarned + gained,
        generatorEarnings: newEarnings,
      };
      return triggerMessage(next);
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
        utilsPerSecond: computeTotalUPS(
          newOwned,
          state.purchasedUpgrades,
          state.prestigeMultiplier,
        ),
      };

      return triggerMessage(next);
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
        utilsPerSecond: computeTotalUPS(
          state.ownedGenerators,
          newPurchased,
          state.prestigeMultiplier,
        ),
      };

      return triggerMessage(next);
    }

    case ACTIONS.BUY_RESEARCH: {
      const { researchId } = action.payload;
      const research = RESEARCHES.find((r) => r.id === researchId);
      if (!research) return state;
      if (state.purchasedResearches[researchId]) return state;
      if (state.utils < research.cost) return state;

      const newPurchased: Record<string, true> = {
        ...state.purchasedResearches,
        [researchId]: true,
      };

      const next: GameState = {
        ...state,
        utils: state.utils - research.cost,
        purchasedResearches: newPurchased,
      };

      return triggerMessage(next);
    }

    case ACTIONS.ACKNOWLEDGE_MESSAGE: {
      return { ...state, activeMessage: null };
    }

    case ACTIONS.RESOLVE_QTE: {
      if (!state.activeMessage || !state.activeMessage.qteChoices) return state;
      const { choiceIndex } = action.payload;
      const choice = state.activeMessage.qteChoices[choiceIndex];

      const stateAfterEffect = choice.consequence.gameEffect
        ? choice.consequence.gameEffect(state)
        : state;

      const consequenceMessage = makeEventMessage(
        choice.consequence,
        stateAfterEffect,
      );

      return {
        ...stateAfterEffect,
        triggeredEvents: {
          ...stateAfterEffect.triggeredEvents,
          [choice.consequence.id]: true,
        },
        terminalMessages: [
          ...stateAfterEffect.terminalMessages,
          consequenceMessage,
        ],
        activeMessage: consequenceMessage,
      };
    }

    case ACTIONS.PRESTIGE: {
      const newMultiplier = computePrestigeMultiplier(
        state.lifetimeUtilsEarned,
      );

      const preservedTriggeredEvents = Object.fromEntries(
        Object.entries(state.triggeredEvents).filter(([id]) => {
          const event = EVENTS.find((e) => e.id === id);
          return event != null && !event.retriggerable;
        }),
      ) as Record<string, true>;

      const freshGenerators: Record<string, number> = {};
      GENERATORS.forEach((g) => {
        freshGenerators[g.id] = 0;
      });

      return {
        gameStarted: true,
        utils: 0,
        totalUtilsEarned: 0,
        lifetimeUtilsEarned: state.lifetimeUtilsEarned,
        prestigeCount: state.prestigeCount + 1,
        utilsPerClick: newMultiplier,
        utilsPerSecond: 0,
        ownedGenerators: freshGenerators,
        generatorEarnings: {},
        purchasedUpgrades: {},
        purchasedResearches: {},
        terminalMessages: [],
        triggeredEvents: preservedTriggeredEvents,
        activeMessage: null,
        prestigeMultiplier: newMultiplier,
      };
    }
  }
}

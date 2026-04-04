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
  {
    id: "shop_intro",
    type: "message",
    unlockAt: 10,
    message:
      "Manually generating utility is far too inefficient. Consider investing your utils in generators and upgrades. In the long run, it's sure to pay off.",
  },
  {
    id: "test_qte",
    type: "qte",
    unlockAt: 20,
    message: "This is a test QTE, no further consequences involved.",
    choices: [
      {
        label: "Accept",
        consequence: {
          id: "test_qte_response_accept",
          type: "message",
          message: "You accepted the test QTE.",
        },
      },
      {
        label: "Decline",
        consequence: {
          id: "test_qte_response_decline",
          type: "message",
          message: "You declined the test QTE.",
        },
      },
    ],
  },
] as const;

export type EventId = (typeof EVENTS)[number]["id"];

import { createContext, useContext, useReducer, type ReactNode } from "react";
import {
  gameReducer,
  buildInitialState,
  type GameState,
  type GameAction,
} from "../store/reducer";
import { useGameLoop } from "../hooks/useGameLoop";

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    buildInitialState,
  );
  useGameLoop(dispatch);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

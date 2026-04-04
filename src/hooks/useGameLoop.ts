import { useEffect } from "react";
import { ACTIONS } from "../store/reducer";
import type { GameAction } from "../store/reducer";

export function useGameLoop(
  dispatch: React.Dispatch<GameAction>,
  tickInterval = 20,
): void {
  const delta = tickInterval / 1000;

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: ACTIONS.TICK, payload: { delta } });
    }, tickInterval);

    return () => clearInterval(id);
  }, []);
}

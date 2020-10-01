import { ActionType } from "../enums/actions.enum";
import { Action } from "../interfaces/action.interface";
import { StateInterface } from "../interfaces/state.interface";

export function createMouseListeners(dispatchAction: (actionType: Action) => void, movePressedMouse, getStateSnapshot: () => StateInterface) {
  const mouseState = { pressed: false };

  return {
    onMouseDown: (event, canvas) => {
      const { top, left } = canvas.getBoundingClientRect();
      const { cellSize } = getStateSnapshot();
      movePressedMouse({
        x: Math.floor((event.x - left) / cellSize),
        y: Math.floor((event.y - top) / cellSize),
      });
      mouseState.pressed = true;
    },
    onMouseMove: (event, canvas) => {
      const { top, left } = canvas.getBoundingClientRect();
      const { cellSize } = getStateSnapshot();
      dispatchAction({
        type: ActionType.MOVE_MOUSE,
        payload: {
          x: (event.x - left),
          y: (event.y - top),
        }
      });
      if (!mouseState.pressed) {
        return
      }
      movePressedMouse({
        x: Math.floor((event.x - left) / cellSize),
        y: Math.floor((event.y - top) / cellSize),
      });
    },
    onMouseUp: () => {
      mouseState.pressed = false;
      const { grid } = getStateSnapshot();
      dispatchAction({ type: ActionType.PUSH_HISTORY, payload: { grid } })
    }
  }
}

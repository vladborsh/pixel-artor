import { ActionType } from "../enums/actions.enum";
import { Action } from "../interfaces/action.interface";

export function createHotKeyListeners(dispatchAction: (actionType: Action) => void) {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (!event.shiftKey && event.metaKey && ['z', 'я'].includes(event.key.toLowerCase())) {
      dispatchAction({ type: ActionType.MOVE_BACK_IN_HISTORY })
    }
    if (event.shiftKey && event.metaKey && ['z', 'я'].includes(event.key.toLowerCase())) {
      dispatchAction({ type: ActionType.MOVE_FORWARD_IN_HISTORY })
    }
  });
}

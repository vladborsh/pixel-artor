import { ActionType } from "../enums/actions.enum";
import { Action } from "../interfaces/action.interface";

export function createColorPicker(dispatchAction: (actionType: Action) => void) {
  const inputEl = document.createElement('input');
  inputEl.type = 'color';
  inputEl.addEventListener('change', (event) =>
    dispatchAction({ type: ActionType.UPDATE_DRAW_COLOR, payload: { color: (<HTMLInputElement>event.target).value.substring(1) }})
  )
  document.body.append(inputEl);

  return inputEl;
}

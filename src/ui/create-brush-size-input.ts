import { ActionType } from "../enums/actions.enum";
import { Action } from "../interfaces/action.interface";

export function createBrushSizeInput(dispatchAction: (actionType: Action) => void) {
  const inputEl = document.createElement('input');
  inputEl.type = 'range';
  inputEl.min = '1';
  inputEl.max = '7';
  inputEl.step = '1';
  inputEl.addEventListener('input', event =>
    dispatchAction({ type: ActionType.UPDATE_BRUSH_SIZE, payload: { brushSize: Number((<HTMLInputElement>event.target).value) }})
  )
  const div = document.createElement('div');
  div.append(inputEl);
  document.body.append(div);

  return inputEl;
}

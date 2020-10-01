import { ActionType } from "../enums/actions.enum";
import { Action } from "../interfaces/action.interface";

export function createCellSizeInput(dispatchAction: (actionType: Action) => void) {
  const inputEl = document.createElement('input');
  inputEl.type = 'range';
  inputEl.min = '3';
  inputEl.max = '15';
  inputEl.step = '1';
  inputEl.addEventListener('input', event =>
    dispatchAction({ type: ActionType.UPDATE_CELL_SIZE, payload: { cellSize: (<HTMLInputElement>event.target).value }})
  )
  const div = document.createElement('div');
  div.append(inputEl);
  document.body.append(div);

  return inputEl;
}

import { ActionType } from "../enums/actions.enum";
import { Tools } from "../enums/tools.enum";
import { Action } from "../interfaces/action.interface";

export function createBrushToolButton(dispatchAction: (actionType: Action) => void) {
  const button = document.createElement('button');
  button.type = 'button';
  button.innerText = 'Brush'
  button.addEventListener('click', () => dispatchAction({ type: ActionType.UPDATE_TOOL, payload: { tool: Tools.BRUSH }}));
  document.body.append(button);

  return button;
}

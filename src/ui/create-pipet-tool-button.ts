import { ActionType } from "../enums/actions.enum";
import { Tools } from "../enums/tools.enum";
import { Action } from "../interfaces/action.interface";

export function createPipetToolButton(dispatchAction: (actionType: Action) => void) {
  const button = document.createElement('button');
  button.type = 'button';
  button.innerText = 'Pipet'
  button.addEventListener('click', () => dispatchAction({ type: ActionType.UPDATE_TOOL, payload: { tool: Tools.PIPET }}));
  document.body.append(button);

  return button;
}

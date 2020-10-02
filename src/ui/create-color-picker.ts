import { ActionType } from "../enums/actions.enum";
import { Action } from "../interfaces/action.interface";
import { StateInterface } from "../interfaces/state.interface";
import { StateListener } from "../state/state-listener.type";

export function createColorPicker(
  dispatchAction: (actionType: Action) => void,
  observeStateProp: (prop: string, listener: StateListener<StateInterface>) => void
) {
  const inputEl = document.createElement("input");
  inputEl.type = "color";
  inputEl.addEventListener("change", (event) =>
    dispatchAction({
      type: ActionType.UPDATE_DRAW_COLOR,
      payload: { color: (<HTMLInputElement>event.target).value.substring(1) },
    })
  );
  observeStateProp('canvasDrawColor', ({ canvasDrawColor }) =>
    inputEl.value = `#${canvasDrawColor}`
  );
  document.body.append(inputEl);

  return inputEl;
}

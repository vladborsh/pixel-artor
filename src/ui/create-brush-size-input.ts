import { ActionType } from "../enums/actions.enum";
import { Action } from "../interfaces/action.interface";
import { StateInterface } from "../interfaces/state.interface";
import { StateListener } from "../state/state-listener.type";

export function createBrushSizeInput(
  dispatchAction: (actionType: Action) => void,
  observeStateProp: (prop: string, listener: StateListener<StateInterface>) => void
) {
  const inputEl = document.createElement("input");
  inputEl.type = "range";
  inputEl.min = "1";
  inputEl.max = "7";
  inputEl.step = "1";
  inputEl.addEventListener("input", (event) =>
    dispatchAction({
      type: ActionType.UPDATE_BRUSH_SIZE,
      payload: { brushSize: Number((<HTMLInputElement>event.target).value) },
    })
  );

  observeStateProp('brushSize', ({ brushSize }) =>
    inputEl.value = `${brushSize}`
  );

  const div = document.createElement("div");
  div.append(inputEl);
  document.body.append(div);

  return inputEl;
}

import { ActionType } from "./enums/actions.enum";
import { createBresenhamCircleDraw } from "./render/create-bresenham-circle-draw";
import { reducers } from "./state/reducers";
import { createSate } from "./state/create-state";
import { Tools } from "./enums/tools.enum";
import { defaultState } from "./state/default-state";
import { Action } from "./interfaces/action.interface";
import { drawGrid } from "./render/draw-grid";
import { drawBrush } from "./render/draw-brush";
import { StateInterface } from "./interfaces/state.interface";
import { createHotKeyListeners } from "./ui/create-hot-key-listeners";
import { clearCanvas } from "./render/clear-canvas";
import { createCanvas } from "./ui/create-canvas";
import { createMouseListeners } from "./ui/create-mouse-listeners";
import { createBrushSizeInput } from "./ui/create-brush-size-input";
import { createCellSizeInput } from "./ui/create-cell-size-inputs";
import { createColorPicker } from "./ui/create-color-picker";
import { createSaveButton } from "./ui/create-save-button";


function createMovePressedMouse(getStateSnapshot: () => StateInterface, dispatchAction: (actionType: Action) => void, drawCircle) {
  return ({x, y}) => {
    const { tool, brushSize } = getStateSnapshot();
    if (tool === Tools.BRUSH) {
      if (brushSize === 1) {
        dispatchAction({ type: ActionType.SET_COLOR, payload: { x, y } })
      } else {
        drawCircle(x, y, brushSize - 1);
      }
    }
  }
}

function animate(context: CanvasRenderingContext2D, getStateSnapshot: () => StateInterface) {
  clearCanvas(context, getStateSnapshot);
  drawGrid(context, getStateSnapshot);
  drawBrush(context, getStateSnapshot);
  requestAnimationFrame(() => animate(context, getStateSnapshot));
}

const { dispatchAction, observeState, getStateSnapshot } = createSate<StateInterface>(defaultState, reducers);

dispatchAction({ type: ActionType.SET_CANVAS_SIZE, payload: getStateSnapshot() });
dispatchAction({ type: ActionType.PUSH_HISTORY, payload: getStateSnapshot() });

const { context, addListener } = createCanvas(getStateSnapshot, observeState);
const drawCircle = createBresenhamCircleDraw(dispatchAction);
const movePressedMouse = createMovePressedMouse(getStateSnapshot, dispatchAction, drawCircle);
const { onMouseDown, onMouseMove, onMouseUp } = createMouseListeners(
  dispatchAction,
  movePressedMouse,
  getStateSnapshot,
);

createHotKeyListeners(dispatchAction);
createColorPicker(dispatchAction);
createSaveButton(getStateSnapshot);
createCellSizeInput(dispatchAction);
createBrushSizeInput(dispatchAction);

addListener("mousedown", onMouseDown);
addListener("mousemove", onMouseMove);
addListener("mouseup", onMouseUp);

animate(context, getStateSnapshot);

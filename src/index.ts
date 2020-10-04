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
import { createBrushToolButton } from "./ui/create-brush-tool-button";
import { createPipetToolButton } from "./ui/create-pipet-tool-button";

const STATE_KEY = 'state';

function saveToStorageMiddleware(state: StateInterface) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function createMovePressedMouse(getStateSnapshot: () => StateInterface, dispatchAction: (actionType: Action) => void, drawCircle) {
  return ({x, y}) => {
    const { tool, brushSize, grid } = getStateSnapshot();
    if (tool === Tools.BRUSH) {
      if (brushSize === 1) {
        dispatchAction({ type: ActionType.SET_COLOR, payload: { x, y } })
      } else {
        drawCircle(x, y, brushSize - 1);
      }
    }
    if (tool === Tools.PIPET) {
      dispatchAction({ type: ActionType.UPDATE_DRAW_COLOR, payload: { color: grid[x][y] }});
    }
  }
}

function animate(context: CanvasRenderingContext2D, getStateSnapshot: () => StateInterface) {
  clearCanvas(context, getStateSnapshot);
  drawGrid(context, getStateSnapshot);
  drawBrush(context, getStateSnapshot);
  requestAnimationFrame(() => animate(context, getStateSnapshot));
}

let initialState = defaultState;

if (localStorage.getItem(STATE_KEY)) {
  initialState = JSON.parse(localStorage.getItem(STATE_KEY));
}

const { dispatchAction, observeStateProp, getStateSnapshot } = createSate<StateInterface>(
  initialState,
  reducers,
  saveToStorageMiddleware,
);

dispatchAction({ type: ActionType.SET_CANVAS_SIZE, payload: getStateSnapshot() });
dispatchAction({ type: ActionType.PUSH_HISTORY, payload: getStateSnapshot() });

const { context, addListener } = createCanvas(getStateSnapshot, observeStateProp);
const drawCircle = createBresenhamCircleDraw(dispatchAction);
const movePressedMouse = createMovePressedMouse(getStateSnapshot, dispatchAction, drawCircle);
const { onMouseDown, onMouseMove, onMouseUp } = createMouseListeners(
  dispatchAction,
  movePressedMouse,
  getStateSnapshot,
);

createHotKeyListeners(dispatchAction);
createColorPicker(dispatchAction, observeStateProp);
createSaveButton(getStateSnapshot);
createCellSizeInput(dispatchAction);
createBrushSizeInput(dispatchAction, observeStateProp);
createBrushToolButton(dispatchAction);
createPipetToolButton(dispatchAction);

addListener("mousedown", onMouseDown);
addListener("mousemove", onMouseMove);
addListener("mouseup", onMouseUp);

animate(context, getStateSnapshot);

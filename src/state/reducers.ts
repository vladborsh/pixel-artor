import { ActionType } from "../enums/actions.enum";
import { StateInterface } from "../interfaces/state.interface";
import { copy } from "../util-helpers/copy.helper";

export const reducers: Record<ActionType, (state: StateInterface, payload: any) => StateInterface> = {
  [ActionType.SET_COLOR]: (state, { x, y }) => {
    if (x >= 0 && x < state.grid.length && y >= 0 && y < state.grid[0].length) {
      state.grid[x][y] = state.canvasDrawColor;
    }
    return state;
  },
  [ActionType.SET_CANVAS_SIZE]: (
    state,
    { cellSize, cellNumberX, cellNumberY }
  ) => ({
    ...state,
    canvasHeight: cellSize * cellNumberY,
    canvasWidth: cellSize * cellNumberX,
  }),
  [ActionType.UPDATE_DRAW_COLOR]: (state, { color }) => ({
    ...state,
    canvasDrawColor: color,
  }),
  [ActionType.UPDATE_CELL_SIZE]: (state, { cellSize }) => ({
    ...state,
    cellSize,
    canvasHeight: cellSize * state.cellNumberY,
    canvasWidth: cellSize * state.cellNumberX,
  }),
  [ActionType.MOVE_MOUSE]: (state, cursorPosition) => ({
    ...state,
    cursorPosition,
  }),
  [ActionType.MOVE_MOUSE]: (state, cursorPosition) => ({
    ...state,
    cursorPosition,
  }),
  // TODO
  [ActionType.MOVE_PRESSED_MOUSE]: (state, {x, y}) => state,
  [ActionType.UPDATE_BRUSH_SIZE]: (state, { brushSize }) => ({
    ...state,
    brushSize,
  }),
  [ActionType.PUSH_HISTORY]: (state, { grid }) => {
    const historyPointer = state.historyPointer + 1;
    const gridHistory = [
      ...state.gridHistory.slice(0, historyPointer),
      copy(grid),
    ];

    return {
      ...state,
      gridHistory,
      historyPointer,
    };
  },
  [ActionType.MOVE_BACK_IN_HISTORY]: (state) => {
    const historyPointer =
      state.historyPointer > 0
        ? state.historyPointer - 1
        : state.historyPointer;

    return {
      ...state,
      historyPointer,
      grid: copy(state.gridHistory[historyPointer]),
    };
  },
  [ActionType.MOVE_FORWARD_IN_HISTORY]: (state) => {
    const historyPointer =
      state.historyPointer < state.gridHistory.length - 1
        ? state.historyPointer + 1
        : state.historyPointer;

    return {
      ...state,
      historyPointer,
      grid: copy(state.gridHistory[historyPointer]),
    };
  },
};

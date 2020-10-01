import { Tools } from "../enums/tools.enum";
import { StateInterface } from "../interfaces/state.interface";

const defaultSpace = 30;

export const defaultState: StateInterface = {
  cellSize: 15,
  canvasHeight: 0,
  canvasWidth: 0,
  cellNumberX: defaultSpace,
  cellNumberY: defaultSpace,
  canvasDefaultColor: "ffffff",
  canvasDrawColor: "555555",
  grid: Array.from({ length: defaultSpace }, () =>
    Array.from({ length: defaultSpace }, () => "ffffff")
  ),
  gridHistory: [],
  historyPointer: 0,
  tool: Tools.BRUSH,
  brushSize: 1,
  cursorPosition: {
    x: 0,
    y: 0,
  },
};

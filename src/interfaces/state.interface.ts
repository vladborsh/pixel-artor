import { Tools } from "../enums/tools.enum";

export interface StateInterface {
  cellSize: number;
  canvasWidth: number;
  canvasHeight: number;
  cellNumberX: number;
  cellNumberY: number;
  canvasDefaultColor: string;
  canvasDrawColor: string;
  grid: string[][];
  gridHistory: string[][][];
  historyPointer: number;
  tool: Tools;
  brushSize: number;
  cursorPosition: {
    x: number;
    y: number;
  },
}

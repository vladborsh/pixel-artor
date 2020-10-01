import { StateInterface } from "../interfaces/state.interface";

export function clearCanvas(context: CanvasRenderingContext2D, getStateSnapshot: () => StateInterface) {
  const state = getStateSnapshot();
  context.fillStyle = `#${state.canvasDefaultColor}`;
  context.fillRect(0, 0, state.canvasWidth, state.canvasHeight);
}

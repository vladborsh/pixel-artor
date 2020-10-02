import { StateInterface } from "../interfaces/state.interface";
import { StateListener } from "../state/state-listener.type";

export function createCanvas(
  getStateSnapshot: () => StateInterface,
  observeStateProp: (prop: string, listener: StateListener<StateInterface>) => void
) {
  const canvas = document.createElement("canvas");
  const { canvasHeight, canvasWidth } = getStateSnapshot();
  canvas.width = canvasHeight;
  canvas.height = canvasWidth;
  canvas.style.cursor = "none";
  document.body.appendChild(canvas);
  const context = canvas.getContext("2d");

  observeStateProp('canvasWidth', ({ canvasWidth }: StateInterface) => canvas.height = canvasWidth)
  observeStateProp('canvasHeight', ({ canvasHeight }: StateInterface) => canvas.height = canvasHeight)

  return {
    context,
    addListener: (event, handler) =>
      canvas.addEventListener(event, (event) => handler(event, canvas)),
  };
}

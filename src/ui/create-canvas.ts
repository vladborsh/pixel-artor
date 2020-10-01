import { StateInterface } from "../interfaces/state.interface";

export function createCanvas(getStateSnapshot: () => StateInterface, observeState: (listener: (state: StateInterface) => void) => void) {
  const canvas = document.createElement("canvas");
  const { canvasHeight, canvasWidth } = getStateSnapshot();
  canvas.width = canvasHeight;
  canvas.height = canvasWidth;
  canvas.style.cursor = 'none'
  document.body.appendChild(canvas);
  const context = canvas.getContext("2d");

  observeState(({ canvasHeight, canvasWidth }) => {
    canvas.width = canvasHeight;
    canvas.height = canvasWidth;
  })

  return {
    context,
    addListener: (event, handler) => canvas.addEventListener(event, event => handler(event, canvas)),
  };
}

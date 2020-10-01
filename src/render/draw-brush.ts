export function drawBrush(context: CanvasRenderingContext2D, getStateSnapshot) {
  const {
    cursorPosition: { x, y },
    brushSize,
    cellSize,
  } = getStateSnapshot();
  context.beginPath();
  context.arc(x, y, brushSize * cellSize, 0, 2 * Math.PI);
  context.stroke();
}

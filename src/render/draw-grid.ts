export function drawGrid(context: CanvasRenderingContext2D, getStateSnapshot) {
  const {
    grid,
    cellSize,
    cellNumberX,
    cellNumberY,
    canvasHeight,
    canvasWidth,
  } = getStateSnapshot();
  for (let i = 0; i < cellNumberX; i++) {
    for (let j = 0; j < cellNumberY; j++) {
      context.fillStyle = `#${grid[i][j]}`;
      context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
  context.lineWidth = 1;
  for (let i = 0; i < cellNumberX; i++) {
    context.beginPath();
    context.moveTo(i * cellSize, 0);
    context.lineTo(i * cellSize, canvasHeight);
    context.stroke();
  }
  for (let i = 0; i < cellNumberY; i++) {
    context.beginPath();
    context.moveTo(0, i * cellSize);
    context.lineTo(canvasWidth, i * cellSize);
    context.stroke();
  }
}

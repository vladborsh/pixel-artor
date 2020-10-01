
export function createImageUrlFromGrid(grid: string[][], cellNumberX: number, cellNumberY: number, cellSize: number) {
  const canvas = document.createElement("canvas");
  canvas.width = cellNumberY * cellSize;
  canvas.height = cellNumberX * cellSize;
  const context = canvas.getContext("2d");
  for (let i = 0; i < cellNumberX; i++) {
    for (let j = 0; j < cellNumberY; j++) {
      context.fillStyle = `#${grid[i][j]}`;
      context.fillRect( i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }

  return canvas.toDataURL('image/png');
}

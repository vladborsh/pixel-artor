import { StateInterface } from "../interfaces/state.interface";
import { createImageUrlFromGrid } from "../util-helpers/create-image-url-from-grid";

export function createSaveButton(getStateSnapshot: () => StateInterface) {
  const button = document.createElement('button');
  button.type = 'button';
  button.innerText = 'Save'
  button.addEventListener('click', () => {
    const { grid, cellNumberX, cellNumberY } = getStateSnapshot();
    const cellSize = 2;
    const anchor = document.createElement('a');
    anchor.setAttribute('href', createImageUrlFromGrid(grid, cellNumberX, cellNumberY, cellSize));
    anchor.setAttribute('download', 'test.png');
    anchor.style.display = 'none';
    document.body.append(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  })
  document.body.append(button);

  return button;
}

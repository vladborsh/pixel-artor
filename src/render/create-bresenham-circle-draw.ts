import { ActionType } from "../enums/actions.enum";
import { Action } from "../interfaces/action.interface";

export function createBresenhamCircleDraw(dispatchAction: (actionType: Action) => void) {
  const setColorInCell = ({ x, y }) =>
    dispatchAction({ type: ActionType.SET_COLOR, payload: { x, y } });

  function putPixels(xc: number, yc: number, x: number, y: number) {
    setColorInCell({ x: xc + x, y: yc + y });
    setColorInCell({ x: xc - x, y: yc + y });
    setColorInCell({ x: xc + x, y: yc - y });
    setColorInCell({ x: xc - x, y: yc - y });
    setColorInCell({ x: xc + y, y: yc + x });
    setColorInCell({ x: xc - y, y: yc + x });
    setColorInCell({ x: xc + y, y: yc - x });
    setColorInCell({ x: xc - y, y: yc - x });
  }

  function putAxiosPixels(xc: number, yc: number, r: number) {
    setColorInCell({ x: xc + r, y: yc });
    setColorInCell({ x: xc - r, y: yc });
    setColorInCell({ x: xc, y: yc - r });
    setColorInCell({ x: xc, y: yc + r });
  }

  return (xc, yc, r) => {
    let x = 0;
    let y = r;
    let d = 3 - 2 * r;
    putAxiosPixels(xc, yc, r);
    while (y >= x) {
      x++;
      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6;
      }
      putPixels(xc, yc, x, y);
    }
  };
}

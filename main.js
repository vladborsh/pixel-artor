const defaultSpace = 10; 

const Tools = {
  BRUSH: 'BRUSH',
}

const ActionType = {
  SET_COLOR: 'SET_COLOR',
  SET_CANVAS_SIZE: 'SET_CANVAS_SIZE',
  UPDATE_DRAW_COLOR: 'UPDATE_DRAW_COLOR',
  UPDATE_CELL_SIZE: 'UPDATE_CELL_SIZE',
  UPDATE_BRUSH_SIZE: 'UPDATE_BRUSH_SIZE',
  MOVE_MOUSE: 'MOVE_MOUSE',
  PUSH_HISTORY: 'PUSH_HISTORY',
  MOVE_BACK_IN_HISTORY: 'MOVE_BACK_IN_HISTORY',
  MOVE_FORWARD_IN_HISTORY: 'MOVE_FORWARD_IN_HISTORY',
};

const defaultState = {
  cellSize: 15,
  cellNumberX: defaultSpace,
  cellNumberY: defaultSpace,
  canvasDefaultColor: "ffffff",
  canvasDrawColor: '555555',
  grid: Array.from({ length: defaultSpace }, () =>
    Array.from(
      { length: defaultSpace },
      () => 'ffffff'
    )
  ),
  gridHistory: [],
  historyPointer: 0,
  tool: Tools.BRUSH,
  brushSize: 1,
  cursorPosition: {
    x: 0,
    y: 0,
  }
}

function copy(arr) {
  const newArr = [];

  for (let row of arr) {
    newArr.push([...row]);
  }

  return newArr;
}

const reducers = {
  [ActionType.SET_COLOR]: (state, { x, y }) => {
    if (x >= 0 && x < state.grid.length && y >= 0 && y < state.grid[0].length) {
      state.grid[x][y] = state.canvasDrawColor;
    }
    return state;
  },
  [ActionType.SET_CANVAS_SIZE]: (state, { cellSize, cellNumberX, cellNumberY }) => ({
    ...state,
    canvasHeight: cellSize * cellNumberY,
    canvasWidth: cellSize * cellNumberX
  }),
  [ActionType.UPDATE_DRAW_COLOR]: (state, { color }) => ({
    ...state,
    canvasDrawColor: color, 
  }),
  [ActionType.UPDATE_CELL_SIZE]: (state, { cellSize }) => ({
    ...state,
    cellSize,
    canvasHeight: cellSize * state.cellNumberY,
    canvasWidth: cellSize * state.cellNumberX,
  }),
  [ActionType.MOVE_MOUSE]: (state, cursorPosition) => ({
    ...state,
    cursorPosition,
  }),
  [ActionType.UPDATE_BRUSH_SIZE]: (state, { brushSize }) => ({
    ...state,
    brushSize,
  }),
  [ActionType.PUSH_HISTORY]: (state, { grid }) => {
    const historyPointer = state.historyPointer + 1;
    const gridHistory = [ ...state.gridHistory.slice(0, historyPointer), copy(grid) ]

    return {
      ...state,
      gridHistory,
      historyPointer,
    }
  },
  [ActionType.MOVE_BACK_IN_HISTORY]: (state) => {
    const historyPointer = state.historyPointer > 0 ? state.historyPointer - 1 : state.historyPointer

    return {
      ...state,
      historyPointer,
      grid: copy(state.gridHistory[historyPointer]),
    }
  },
  [ActionType.MOVE_FORWARD_IN_HISTORY]: (state) => {
    const historyPointer = state.historyPointer < state.gridHistory.length - 1 ? state.historyPointer + 1 : state.historyPointer;

    return {
      ...state,
      historyPointer,
      grid: copy(state.gridHistory[historyPointer]),
    }
  },
};

function createSate(defaultState, reducers) {
  let state = defaultState;
  const listeners = []

  return {
    dispatchAction(ActionType) {
      state = reducers[ActionType.type](state, ActionType.payload);
      listeners.forEach(callback => callback(state));
    },
    observeState(listener) {
      listeners.push(listener);
    },
    getStateSnapshot() {
      return { ...state };
    }
  }
}

function createCanvas(getStateSnapshot, observeState) {
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

function createHotKeyListeners(dispatchAction) {
  document.addEventListener('keydown', (event) => {
    if (!event.shiftKey && event.metaKey && ['z'].includes(event.key.toLowerCase())) {
      dispatchAction({ type: ActionType.MOVE_BACK_IN_HISTORY })
    }
    if (event.shiftKey && event.metaKey && ['z'].includes(event.key.toLowerCase())) {
      dispatchAction({ type: ActionType.MOVE_FORWARD_IN_HISTORY })
    }
  });
}

function createMouseListeners(dispatchAction, movePressedMouse, getStateSnapshot) {
  const mouseState = { pressed: false };
  const moveMouse = ({x, y}) => dispatchAction({ type: ActionType.MOVE_MOUSE, payload: { x, y } });

  return {
    onMouseDown: (event, canvas) => {
      const { top, left } = canvas.getBoundingClientRect();
      const { cellSize } = getStateSnapshot();
      movePressedMouse({
        x: Math.floor((event.x - left) / cellSize),
        y: Math.floor((event.y - top) / cellSize),
      });
      mouseState.pressed = true;
    },
    onMouseMove: (event, canvas) => {
      const { top, left } = canvas.getBoundingClientRect();
      const { cellSize } = getStateSnapshot();
      moveMouse({ 
        x: (event.x - left),
        y: (event.y - top),
      });
      if (!mouseState.pressed) {
        return
      }
      movePressedMouse({ 
        x: Math.floor((event.x - left) / cellSize),
        y: Math.floor((event.y - top) / cellSize),
      });
    },
    onMouseUp: () => {
      mouseState.pressed = false;
      const { grid } = getStateSnapshot();
      dispatchAction({ type: ActionType.PUSH_HISTORY, payload: { grid } })
    }
  }
}

function createImageUrlFromGrid(grid, cellNumberX, cellNumberY, cellSize) {
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

function createColorPicker(dispatchAction) {
  const inputEl = document.createElement('input');
  inputEl.type = 'color';
  inputEl.addEventListener('change', event =>
    dispatchAction({ type: ActionType.UPDATE_DRAW_COLOR, payload: { color: event.target.value.substring(1) }})
  )
  document.body.append(inputEl);

  return inputEl;
}

function createSaveButton(getStateSnapshot) {
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

function createCellSizeInput() {
  const inputEl = document.createElement('input');
  inputEl.type = 'range';
  inputEl.min = 3;
  inputEl.max = 15;
  inputEl.step = 1;
  inputEl.addEventListener('input', event =>
    dispatchAction({ type: ActionType.UPDATE_CELL_SIZE, payload: { cellSize: event.target.value }})
  )
  const div = document.createElement('div');
  div.append(inputEl);
  document.body.append(div);

  return inputEl;
}

function createBrushSizeInput(dispatchAction) {
  const inputEl = document.createElement('input');
  inputEl.type = 'range';
  inputEl.min = 1;
  inputEl.max = 7;
  inputEl.step = 1;
  inputEl.addEventListener('input', event =>
    dispatchAction({ type: ActionType.UPDATE_BRUSH_SIZE, payload: { brushSize: Number(event.target.value) }})
  )
  const div = document.createElement('div');
  div.append(inputEl);
  document.body.append(div);

  return inputEl;
}

function createMovePressedMouse(getStateSnapshot, dispatchAction, drawCircle) {
  return ({x, y}) => {
    const { tool, brushSize } = getStateSnapshot();
    if (tool === Tools.BRUSH) {
      if (brushSize === 1) {
        dispatchAction({ type: ActionType.SET_COLOR, payload: { x, y } })
      } else {
        drawCircle(x, y, brushSize - 1);
      }
    }
  }
}

function createBresenhamCircleDraw(dispatchAction) {
  const setColorInCell = ({x, y}) => dispatchAction({ type: ActionType.SET_COLOR, payload: { x, y } })

  function putPixels(xc, yc, x, y) {
    setColorInCell({ x: xc+x, y: yc+y }); 
    setColorInCell({ x: xc-x, y: yc+y }); 
    setColorInCell({ x: xc+x, y: yc-y }); 
    setColorInCell({ x: xc-x, y: yc-y }); 
    setColorInCell({ x: xc+y, y: yc+x }); 
    setColorInCell({ x: xc-y, y: yc+x }); 
    setColorInCell({ x: xc+y, y: yc-x }); 
    setColorInCell({ x: xc-y, y: yc-x }); 
  }

  function putAxiosPixels(xc, yc, r) {
    setColorInCell({ x: xc + r, y: yc });
    setColorInCell({ x: xc - r, y: yc });
    setColorInCell({ x: xc, y: yc - r });
    setColorInCell({ x: xc, y: yc + r });
  }

  return (xc, yc, r) => {
    let x = 0;
    let y = r;
    let d = 3 - 2 * r;
    putAxiosPixels(xc, yc, r)
    while(y >= x) {
      x++;
      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6
      }
      putPixels(xc, yc, x, y);
    }
  }
}

function drawGrid(context, getStateSnapshot) {
  const { grid, cellSize, cellNumberX, cellNumberY, canvasHeight, canvasWidth } = getStateSnapshot();
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

function drawBrush(context, getStateSnapshot) {
  const { cursorPosition: { x, y }, brushSize, cellSize } = getStateSnapshot();
  context.beginPath();
  context.arc(x, y, brushSize * cellSize, 0, 2 * Math.PI);
  context.stroke();
}

function clear(context, getStateSnapshot) {
  const state = getStateSnapshot();
  context.fillStyle = `#${state.canvasDefaultColor}`;
  context.fillRect(0, 0, state.canvasWidth, state.canvasHeight);
}

function animate(context, getStateSnapshot) {
  clear(context, getStateSnapshot);
  drawGrid(context, getStateSnapshot);
  drawBrush(context, getStateSnapshot);
  requestAnimationFrame(() => animate(context, getStateSnapshot));
}

const { dispatchAction, observeState, getStateSnapshot } = createSate(defaultState, reducers);
dispatchAction({ type: ActionType.SET_CANVAS_SIZE, payload: getStateSnapshot() });
dispatchAction({ type: ActionType.PUSH_HISTORY, payload: getStateSnapshot() });

const { context, addListener } = createCanvas(getStateSnapshot, observeState);
const drawCircle = createBresenhamCircleDraw(dispatchAction);
const movePressedMouse = createMovePressedMouse(getStateSnapshot, dispatchAction, drawCircle);
const { onMouseDown, onMouseMove, onMouseUp } = createMouseListeners(
  dispatchAction,
  movePressedMouse,
  getStateSnapshot,
);
const hotKeys = createHotKeyListeners(dispatchAction);
const colorPicker = createColorPicker(dispatchAction);
const saveButton = createSaveButton(getStateSnapshot);
const cellSizeInput = createCellSizeInput(dispatchAction);
const brushSizeInput = createBrushSizeInput(dispatchAction);

addListener("mousedown", onMouseDown);
addListener("mousemove", onMouseMove);
addListener("mouseup", onMouseUp);

animate(context, getStateSnapshot);

const defaultSpace = 30; 

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
  )
}

const ActionType = {
  SET_COLOR: 'SET_COLOR',
  SET_CANVAS_SIZE: 'SET_CANVAS_SIZE',
  UPDATE_DRAW_COLOR: 'UPDATE_DRAW_COLOR',
  UPDATE_CELL_SIZE: 'UPDATE_CELL_SIZE',
};

const reducers = {
  [ActionType.SET_COLOR]: (state, { x, y, color }) => {
    state.grid[x][y] = color;
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
  })
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

function createMouseListeners(dispatchAction, getStateSnapshot) {
  const mouseState = {
    pressed: false,
  }

  return {
    onMouseDown: (event, canvas) => {
      const { top, left } = canvas.getBoundingClientRect();
      const { canvasDrawColor, cellSize } = getStateSnapshot();
      const cellPosition = {
        x: Math.floor((event.x - left) / cellSize),
        y: Math.floor((event.y - top) / cellSize),
      }
      dispatchAction({ type: ActionType.SET_COLOR, payload: { x: cellPosition.x, y: cellPosition.y, color: canvasDrawColor } });
      mouseState.pressed = true;
    },
    onMouseMove: (event, canvas) => {
      if (!mouseState.pressed) {
        return
      }
      const { top, left } = canvas.getBoundingClientRect();
      const { canvasDrawColor, cellSize } = getStateSnapshot();
      const cellPosition = {
        x: Math.floor((event.x - left) / cellSize),
        y: Math.floor((event.y - top) / cellSize),
      }
      dispatchAction({ type: ActionType.SET_COLOR, payload: { x: cellPosition.x, y: cellPosition.y, color: canvasDrawColor } });
    },
    onMouseUp: () => {
      mouseState.pressed = false;
    }
  }
}

function createImageUrlFromGrid(grid, cellNumberX, cellNumberY, cellSize) {
  const canvas = document.createElement("canvas");
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

function clear(context, getStateSnapshot) {
  const state = getStateSnapshot();
  context.fillStyle = `#${state.canvasDefaultColor}`;
  context.fillRect(0, 0, state.canvasWidth, state.canvasHeight);
}

function animate(context, getStateSnapshot) {
  clear(context, getStateSnapshot);
  drawGrid(context, getStateSnapshot);
  requestAnimationFrame(() => animate(context, getStateSnapshot));
}

const { dispatchAction, observeState, getStateSnapshot } = createSate(defaultState, reducers);
dispatchAction({ type: ActionType.SET_CANVAS_SIZE, payload: getStateSnapshot() });

const { context, addListener } = createCanvas(getStateSnapshot, observeState);
const { onMouseDown, onMouseMove, onMouseUp } = createMouseListeners(dispatchAction, getStateSnapshot);
const colorPicker = createColorPicker(dispatchAction);
const saveButton = createSaveButton(getStateSnapshot);
const cellSizeInput = createCellSizeInput(dispatchAction);

addListener("mousedown", onMouseDown);
addListener("mousemove", onMouseMove);
addListener("mouseup", onMouseUp);

animate(context, getStateSnapshot);

const defaultState = {
  cellSize: 15,
  cellNumberX: 30,
  cellNumberY: 30,
  canvasDefaultColor: "ffffff",
  canvasDrawColor: '555555',
  grid: Array.from({ length: 30 }, () =>
    Array.from(
      { length: 30 },
      () => 'ffffff'
    )
  )
}

const Action = {
  SET_COLOR: 'SET_COLOR',
  SET_CANVAS_SIZE: 'SET_CANVAS_SIZE',
};

const reducers = {
  [Action.SET_COLOR]: (state, { x, y, color }) => ({
    ...state,
    grid: state.grid.map((row, i) => i !== x ? row : row.map((cell, j) => j !== y ? cell : color))
  }),
  [Action.SET_CANVAS_SIZE]: (state, { cellSize, cellNumberX, cellNumberY }) => ({
    ...state,
    canvasHeight: cellSize * cellNumberY,
    canvasWidth: cellSize * cellNumberX
  })
}

function createSate(defaultState, reducers) {
  let state = defaultState;
  const listeners = []

  return {
    dispatchAction(action) {
      state = reducers[action.type](state, action.payload);
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

function createCanvas(getStateSnapshot) {
  const canvas = document.createElement("canvas");
  const { canvasHeight, canvasWidth } = getStateSnapshot();
  canvas.width = canvasHeight;
  canvas.height = canvasWidth;
  document.body.appendChild(canvas);
  const context = canvas.getContext("2d");

  return {
    context,
    addListener: (event, handler) =>
      canvas.addEventListener(event, event => handler(event, canvas))
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
      dispatchAction({ type: Action.SET_COLOR, payload: { x: cellPosition.x, y: cellPosition.y, color: canvasDrawColor } });
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
      dispatchAction({ type: Action.SET_COLOR, payload: { x: cellPosition.x, y: cellPosition.y, color: canvasDrawColor } });
    },
    onMouseUp: () => {
      mouseState.pressed = false;
    }
  }
}

function drawGrid(context, getStateSnapshot) {
  const state = getStateSnapshot();
  for (let i = 0; i < state.cellNumberX; i++) {
    for (let j = 0; j < state.cellNumberY; j++) {
      context.fillStyle = `#${state.grid[i][j]}`;

      context.fillRect(
        i * state.cellSize,
        j * state.cellSize,
        state.cellSize,
        state.cellSize
      );
    }
  }
  context.lineWidth = 1;
  for (let i = 0; i < state.cellNumberX; i++) {
    context.beginPath();
    context.moveTo(i * state.cellSize, 0);
    context.lineTo(i * state.cellSize, state.canvasHeight);
    context.stroke();
  }
  for (let i = 0; i < state.cellNumberY; i++) {
    context.beginPath();
    context.moveTo(0, i * state.cellSize);
    context.lineTo(state.canvasWidth, i * state.cellSize);
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
dispatchAction({ type: Action.SET_CANVAS_SIZE, payload: getStateSnapshot() });

const { context, addListener } = createCanvas(getStateSnapshot);
const { onMouseDown, onMouseMove, onMouseUp } = createMouseListeners(dispatchAction, getStateSnapshot);

addListener("mousedown", onMouseDown);
addListener("mousemove", onMouseMove);
addListener("mouseup", onMouseUp);

animate(context, getStateSnapshot);

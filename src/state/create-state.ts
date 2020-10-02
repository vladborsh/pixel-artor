import { ActionType } from "../enums/actions.enum";
import { Action } from "../interfaces/action.interface";
import { StateListener } from "./state-listener.type";

export function createSate<T>(defaultState: T, reducers: Record<ActionType, (state: T, payload: any) => T>) {
  let state = defaultState;
  let prevState = null;
  const listeners: StateListener<T>[] = [];
  const propListeners: Record<string, StateListener<T>[]> = {};

  function getChangedProps(state: T, prevState: T) {
    return Object.keys(state).filter(key => state[key] !== prevState[key]);
  }

  return {
    dispatchAction(actionType: Action): void {
      prevState = state;
      state = reducers[actionType.type](state, actionType.payload);
      listeners.forEach(callback => callback(state));
      getChangedProps(state, prevState)
      .filter(propKey => !!propListeners[propKey])
      .forEach(propKey => propListeners[propKey].forEach(callback => callback(state)))
    },
    observeState(listener: StateListener<T>): void {
      listeners.push(listener);
      listener(state);
    },
    observeStateProp(prop: string, listener: StateListener<T>): void {
      if (!propListeners[prop]) {
        propListeners[prop] = [];
      }
      propListeners[prop].push(listener);
      listener(state);
    },
    getStateSnapshot(): T {
      return { ...state };
    },
  };
}

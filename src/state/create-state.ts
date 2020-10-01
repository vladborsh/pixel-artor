import { ActionType } from "../enums/actions.enum";
import { Action } from "../interfaces/action.interface";

export function createSate<T>(defaultState: T, reducers: Record<ActionType, (state: T, payload: any) => T>) {
  let state = defaultState;
  const listeners = [];

  return {
    dispatchAction(actionType: Action): void {
      state = reducers[actionType.type](state, actionType.payload);
      listeners.forEach((callback) => callback(state));
    },
    observeState(listener: (state: T) => void): void {
      listeners.push(listener);
    },
    getStateSnapshot(): T {
      return { ...state };
    },
  };
}

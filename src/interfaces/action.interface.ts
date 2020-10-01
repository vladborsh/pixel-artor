import { ActionType } from "../enums/actions.enum";

export interface Action {
  type: ActionType;
  payload?: any;
}

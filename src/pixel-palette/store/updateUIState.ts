import { Action, Reducer } from "./store";
import { State, ImageState } from "./pixelStore";

interface Payload 
{
    showResizeModal?: boolean;
}

export const UpdateUIStateActionType = 'UPDATE_UI_STATE';
export interface UpdateUIStateAction extends Action
{
    payload: Payload;
}

export class UpdateUIState extends Reducer<State>
{
    static action(showResizeModal?: boolean): UpdateUIStateAction
    {
        return {
            type: UpdateUIStateActionType, payload: { showResizeModal }
        }
    }

    actionTypes = [UpdateUIStateActionType];

    execute(state: State, action: UpdateUIStateAction): State
    {
        const newUIState = {...state.uiState, ...action.payload};
        return {...state, uiState: newUIState};
    }
}
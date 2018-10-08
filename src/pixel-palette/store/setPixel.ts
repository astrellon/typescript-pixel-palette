import { Action, Reducer } from "./store";
import { State, ImageState } from "./pixelStore";
import { set2dArrayImmutable } from "../utils";

export const SetPixelActionType = 'SET_PIXEL';
export interface SetPixelAction extends Action
{
    x: number,
    y: number,
    baseColour: number,
}

export class SetPixel extends Reducer<State>
{
    static action(x: number, y: number, baseColour: number): SetPixelAction
    {
        return {
            type: SetPixelActionType,
            x, y, baseColour
        }
    }

    actionTypes = [SetPixelActionType];

    execute(state: State, action: SetPixelAction): State
    {
        const newToolPixels = set2dArrayImmutable(state.image.toolPixelIndices, action.x, action.y, action.baseColour);
        const newImage: ImageState = { ...state.image, toolPixelIndices: newToolPixels };

        return {...state, image: newImage};
    }
}
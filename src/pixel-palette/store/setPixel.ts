import { Action, Reducer } from "./store";
import { State, ImageState } from "./pixelStore";

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
        const pixels: number[]= [...state.image.pixelIndices];
        pixels[action.y * state.image.width + action.x] = action.baseColour;
        const newImage: ImageState = {...state.image, pixelIndices: pixels};

        return {...state, image: newImage};
    }
}
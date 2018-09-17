import { Action, Reducer } from "./store";
import { State, ImageState } from "./pixelStore";

export const SetPixelsActionType = 'SET_PIXELS';
export interface SetPixelsAction extends Action
{
    x: number,
    y: number,
    width: number,
    height: number,
    pixels: number[],
}

export class SetPixels extends Reducer<State>
{
    static action(x: number, y: number, width: number, height: number, pixels: number[]): SetPixelsAction
    {
        if (pixels.length !== width * height)
        {
            throw new Error('Pixels must be width * height');
        }

        return {
            type: SetPixelsActionType,
            x, y, width, height, pixels
        }
    }

    actionTypes = [SetPixelsActionType];

    execute(state: State, action: SetPixelsAction): State
    {
        const pixels: number[]= [...state.image.pixelIndices];
        const maxY = Math.min(state.image.height, action.height + action.y);
        const maxX = Math.min(state.image.width, action.width + action.x);
        for (let y = action.y; y < maxY; y++)
        for (let x = action.x; x < maxX; x++)
        {
            const imageIndex = y * state.image.width + x;
            const actionIndex = (y - action.y) * action.width + (x - action.x);

            pixels[imageIndex] = action.pixels[actionIndex];
        }
        const newImage: ImageState = {...state.image, pixelIndices: pixels};

        return {...state, image: newImage};
    }
}
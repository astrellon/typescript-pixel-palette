import { Action, Reducer } from "./store";
import { State, ImageState } from "./pixelStore";

export const SetPixelsActionType = 'SET_PIXELS';
export interface SetPixelsAction extends Action
{
    x: number,
    y: number,
    width: number,
    height: number,
    pixels: number[][],
}

export class SetPixels extends Reducer<State>
{
    static action(x: number, y: number, width: number, height: number, pixels: number[][]): SetPixelsAction
    {
        if (pixels.length !== height)
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
        const newPixels: number[][] = [...state.image.toolPixelIndices] as number[][];
        const maxY = Math.min(state.image.height, action.height + action.y);
        const maxX = Math.min(state.image.width, action.width + action.x);
        for (let y = action.y; y < maxY; y++)
        {
            const row = newPixels[y];
            const newPixelRow = !!row ? [...row] : [];
            newPixels[y] = newPixelRow;
            for (let x = action.x; x < maxX; x++)
            {
                newPixelRow[x] = action.pixels[y - action.y][x - action.x];
            }
        }
        const newImage: ImageState = {...state.image, toolPixelIndices: newPixels};

        return {...state, image: newImage};
    }
}
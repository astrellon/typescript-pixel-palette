import { Action, Reducer } from "./store";
import { State } from "./pixelStore";

export const ResizeImageActionType = 'RESIZE_IMAGE';
export interface ResizeImageAction extends Action
{
    width: number,
    height: number,
}

export class ResizeImage extends Reducer<State>
{
    static action(width: number, height: number): ResizeImageAction
    {
        return {
            type: ResizeImageActionType,
            width, height
        }
    }

    actionTypes = [ResizeImageActionType];

    execute(state: State, action: ResizeImageAction): State
    {
        const newImage = {...state.image, width: action.width, height: action.height};
        const newPixels: number[][] = new Array<Array<number>>(action.height);
        for (let y = 0; y < action.height; y++)
        {
            const newPixelRow = new Array<number>(action.width);
            newPixels[y] = newPixelRow;
            for (let x = 0; x < action.width; x++)
            {
                newPixelRow[x] = 0;
            }
        }

        const minWidth = Math.min(state.image.width, action.width);
        const minHeight = Math.min(state.image.height, action.height);

        for (let y = 0; y < minHeight; y++)
        for (let x = 0; x < minWidth; x++)
        {
            newPixels[y][x] = state.image.pixelIndices[y][x];
        }

        newImage.pixelIndices = newPixels;
        newImage.toolPixelIndices = [];

        return {...state, image: newImage};
    }
}
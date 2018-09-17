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
        const pixels: number[]= new Array<number>(action.width * action.height);

        const minWidth = Math.min(state.image.width, action.width);
        const minHeight = Math.min(state.image.height, action.height);

        for (let y = 0; y < minHeight; y++)
        for (let x = 0; x < minWidth; x++)
        {
            const origIndex = y * state.image.width + x;
            const newIndex = y * action.width + x;

            pixels[newIndex] = state.image.pixelIndices[origIndex];
        }

        newImage.pixelIndices = pixels;

        return {...state, image: newImage};
    }
}
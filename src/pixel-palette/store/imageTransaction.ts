import { Action, Reducer } from "./store";
import { State, ImageState } from "./pixelStore";

type TransitionState = 'off' | 'on' | 'cancel';
export const ImageTransactionActionType = 'IMAGE_TRANSACTION';
export interface ImageTransactionAction extends Action
{
    state: TransitionState;
}

export class ImageTransaction extends Reducer<State>
{
    static begin(): ImageTransactionAction
    {
        return {
            type: ImageTransactionActionType, state: 'on'
        }
    }

    static end(): ImageTransactionAction
    {
        return {
            type: ImageTransactionActionType, state: 'off'
        }
    }

    static cancel(): ImageTransactionAction
    {
        return {
            type: ImageTransactionActionType, state: 'cancel'
        }
    }

    actionTypes = [ImageTransactionActionType];

    execute(state: State, action: ImageTransactionAction): State
    {
        if (action.state === 'on')
        {
            return { ...state, editingImage: true };
        }

        if (action.state === 'cancel')
        {
            const newImageState: ImageState = { ...state.image };
            newImageState.toolPixelIndices = [];

            return { ...state, editingImage: false, image: newImageState };
        }

        const newImagePixels: number[][] = [ ...state.image.pixelIndices ] as number[][];
        for (let y = 0; y < state.image.toolPixelIndices.length; y++)
        {
            const toolPixelRow = state.image.toolPixelIndices[y];
            if (toolPixelRow === undefined)
            {
                continue;
            }

            const newPixelRow: number[] = [ ...newImagePixels[y] ];
            newImagePixels[y] = newPixelRow;

            for (let x = 0; x < state.image.width; x++)
            {
                const pixel = toolPixelRow[x];
                if (pixel === undefined)
                {
                    continue;
                }
                newPixelRow[x] = pixel;
            }
        }

        const newImage: ImageState = { ...state.image, pixelIndices: newImagePixels, toolPixelIndices: [] };

        return {...state, editingImage: false, image: newImage};
    }
}
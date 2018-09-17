import { Action, Reducer } from "./store";
import { ColourMap, State, PaletteState } from "./pixelStore";

export const ResizePaletteActionType = 'RESIZE_PALETTE';
export interface ResizePaletteAction extends Action
{
    colourMap?: ColourMap,
    dim1Size?: number,
    dim2Size?: number,
    dim3Size?: number,
    numberOfBaseColours?: number
}

export class ResizePalette extends Reducer<State>
{
    static action(numberOfBaseColours?: number, dim1Size?: number, dim2Size?: number, dim3Size?: number): ResizePaletteAction
    {
        const result: ResizePaletteAction = {
            type: ResizePaletteActionType,
        };

        if (typeof(numberOfBaseColours) === 'number') { result.numberOfBaseColours = numberOfBaseColours; }
        if (typeof(dim1Size) === 'number') { result.dim1Size = dim1Size; }
        if (typeof(dim2Size) === 'number') { result.dim2Size = dim2Size; }
        if (typeof(dim3Size) === 'number') { result.dim3Size = dim3Size; }

        return result;
    }

    actionTypes = [ResizePaletteActionType];

    execute(state: State, action: ResizePaletteAction): State
    {
        const newPalette: PaletteState = { ...state.palette };
        if (typeof(action.numberOfBaseColours) === 'number') { newPalette.numberOfBaseColours = action.numberOfBaseColours; }
        if (typeof(action.dim1Size) === 'number') { newPalette.dim1Size = action.dim1Size; }
        if (typeof(action.dim2Size) === 'number') { newPalette.dim2Size = action.dim2Size; }
        if (typeof(action.dim3Size) === 'number') { newPalette.dim3Size = action.dim3Size; }

        return {...state, palette: newPalette};
    }
}
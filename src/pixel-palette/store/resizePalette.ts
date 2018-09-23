import { Action, Reducer } from "./store";
import { ColourMap, State, PaletteState } from "./pixelStore";
import Palette from "../palette";

export const ResizePaletteActionType = 'RESIZE_PALETTE';
export interface ResizePaletteAction extends Action
{
    colourMap?: ColourMap,
    dim1Size?: number,
    dim2Size?: number,
    dim3Size?: number,
    numberOfBaseColours?: number
}

interface ResizeValues
{
    dim1Size?: number,
    dim2Size?: number,
    dim3Size?: number,
    numberOfBaseColours?: number
}

export class ResizePalette extends Reducer<State>
{
    static action(resizeValues: ResizeValues): ResizePaletteAction
    {
        const result: ResizePaletteAction = {
            ...resizeValues,
            type: ResizePaletteActionType,
        };

        for (let prop in result)
        {
            if (prop === 'type') continue;

            if (result[prop] < 1)
            {
                result[prop] = 1;
            }
        }

        return result;
    }

    actionTypes = [ResizePaletteActionType];

    execute(state: State, action: ResizePaletteAction): State
    {
        const newColourMap: ColourMap = {...state.palette.colourMap};
        const newPalette: PaletteState = { ...state.palette, colourMap: newColourMap };

        if (typeof(action.numberOfBaseColours) === 'number') { newPalette.numberOfBaseColours = action.numberOfBaseColours; }
        if (typeof(action.dim1Size) === 'number') { newPalette.dim1Size = action.dim1Size; }
        if (typeof(action.dim2Size) === 'number') { newPalette.dim2Size = action.dim2Size; }
        if (typeof(action.dim3Size) === 'number') { newPalette.dim3Size = action.dim3Size; }

        if (newPalette.dim1Size > state.palette.dim1Size)
        {
            for (let x = 0; x < newPalette.numberOfBaseColours; x++)
            for (let y = state.palette.dim1Size; y < newPalette.dim1Size; y++)
            {
                const oldIndex = Palette.makeIndex(x, state.palette.dim1Size - 1, 0, 0);
                const newIndex = Palette.makeIndex(x, y, 0, 0);
                newColourMap[newIndex] = newColourMap[oldIndex];
            }
        }

        if (newPalette.dim2Size > state.palette.dim2Size)
        {
            for (let x = 0; x < newPalette.numberOfBaseColours; x++)
            for (let y = 0; y < newPalette.dim1Size; y++)
            for (let z = state.palette.dim2Size; z < newPalette.dim2Size; z++)
            {
                const oldIndex = Palette.makeIndex(x, y, state.palette.dim2Size - 1, 0);
                const newIndex = Palette.makeIndex(x, y, z, 0);
                newColourMap[newIndex] = newColourMap[oldIndex];
            }
        }

        if (newPalette.dim3Size > state.palette.dim3Size)
        {
            for (let x = 0; x < newPalette.numberOfBaseColours; x++)
            for (let y = 0; y < newPalette.dim1Size; y++)
            for (let z = 0; z < newPalette.dim2Size; z++)
            for (let w = state.palette.dim3Size; w < newPalette.dim3Size; w++)
            {
                const oldIndex = Palette.makeIndex(x, y, z, state.palette.dim3Size - 1);
                const newIndex = Palette.makeIndex(x, y, z, w);
                newColourMap[newIndex] = newColourMap[oldIndex];
            }
        }

        return {...state, palette: newPalette};
    }
}
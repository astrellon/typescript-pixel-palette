import { Store } from "./store";
import { ResizePalette } from "./resizePalette";
import { UpdateColour } from "./updateColour";
import { ResizeImage } from "./resizeImage";
import { SetPixel } from "./setPixel";
import { SetPixels } from "./setPixels";

export interface ImageState
{
    width: number;
    height: number;
    pixelIndices: ReadonlyArray<number>
}

function toHex(input: number)
{
    let result = input.toString(16);
    if (result.length < 2)
    {
        return `0${result}`;
    }
    return result;
}

export interface ColourState {
    red: number, 
    green: number, 
    blue: number, 
    alpha: number
};
    
export function toHexString(colour: ColourState): string
{
    return toHex(colour.red) + toHex(colour.green) + toHex(colour.blue);
}
export function toHexAlphaString(colour: ColourState): string
{
    return toHex(colour.red) + toHex(colour.green) + toHex(colour.blue) + toHex(colour.alpha);
}
export function toRgbString(colour: ColourState): string
{
    return `rgb(${colour.red}, ${colour.green}, ${colour.blue})`;
}

export type ColourMap = { [baseColour: number]: ColourState }
export interface PaletteState
{
    colourMap: ColourMap;
    numberOfBaseColours: number;
    dim1Size: number;
    dim2Size: number;
    dim3Size: number;
}

export interface State
{
    image: ImageState;
    palette: PaletteState;
}

const initialStore: State = {
    image: {
        height: 0,
        width: 0,
        pixelIndices: []
    },
    palette: {
        colourMap: {},
        dim1Size: 1,
        dim2Size: 1,
        dim3Size: 1,
        numberOfBaseColours: 0
    }
}

export const store = new Store<State>(initialStore);

store.addReducer(new ResizePalette());
store.addReducer(new UpdateColour());
store.addReducer(new ResizeImage());
store.addReducer(new SetPixel());
store.addReducer(new SetPixels());
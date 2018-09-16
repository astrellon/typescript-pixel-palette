import { Store, Action, Reducer } from "./store";

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

type ColourMap = { [baseColour: number]: ColourState }
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

export const store = new Store<State>({
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
});

export const UpdateColourActionType = 'UPDATE_COLOUR';
export interface UpdateColourAction extends Action
{
    index: number,
    colour: ColourState
}

export class UpdateColour extends Reducer<State>
{
    static action(index: number, colour: ColourState): UpdateColourAction
    {
        return {
            type: UpdateColourActionType,
            index, colour
        };
    }

    actionTypes = [UpdateColourActionType];

    execute(state: State, action: UpdateColourAction): State
    {
        const newColours: ColourMap = {...state.palette.colourMap, [action.index]: action.colour};
        const newPalette: PaletteState = {
            ...state.palette,
            colourMap: newColours
        }
        return {...state, palette: newPalette};
    }
}


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

store.addReducer(new ResizePalette());
store.addReducer(new UpdateColour());
store.addReducer(new ResizeImage());
store.addReducer(new SetPixel());
store.addReducer(new SetPixels());
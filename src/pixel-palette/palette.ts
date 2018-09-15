import Colour from "./colour";

type ColourMap = { [baseColour: number]: Colour }

function randomColour(): number
{
    return Math.floor(Math.random() * 256.0);
}

export type UpdateCallback = () => void;

export function doNothing() {}

export default class Palette
{
    colours: ColourMap = {};
    numberOfBaseColours: number;
    dim1Size: number;
    dim2Size: number;
    dim3Size: number;
    onUpdateCallback: UpdateCallback = doNothing;

    constructor(numBaseColours: number, dim1Size: number = 1, dim2Size: number = 1, dim3Size: number = 1)
    {
        this.numberOfBaseColours = numBaseColours;
        this.dim1Size = dim1Size;
        this.dim2Size = dim2Size;
        this.dim3Size = dim3Size;
    }

    hasBaseColour(baseColour: number)
    {
        return !!this.colours[baseColour];
    }

    addNewColour(): number
    {
        for (let i = 0; i < 256; i++)
        {
            if (!this.colours[i])
            {
                this.colours[i] = new Colour(randomColour(), randomColour(), randomColour(), 255);
                return i;
            }
        }

        return -1;
    }

    getColour (baseColour: number, dim1: number = 0, dim2: number = 0, dim3: number = 0): Colour
    {
        const index = Palette.makeIndex(baseColour, dim1, dim2, dim3);
        let result = this.colours[index];
        if (result)
        {
            return result;
        }

        if (dim1 !== 0 && dim2 !== 0 && dim3 !== 0)
        {
            result = this.colours[baseColour & 0xFF];
        }

        return result || Colour.empty;
    }

    getColourIndex (index: number): Colour
    {
        const result = this.colours[index];

        return result || Colour.empty;
    }

    setColour (colour: Colour, baseColour: number, dim1: number = 0, dim2: number = 0, dim3: number = 0)
    {
        const index = Palette.makeIndex(baseColour, dim1, dim2, dim3);
        this.colours[index] = colour;

        this.onUpdateCallback();
    }

    setColourIndex(colour: Colour, index: number)
    {
        this.colours[index] = colour;

        this.onUpdateCallback();
    }

    static makeIndex(baseColour: number, dim1: number, dim2: number, dim3: number)
    {
        return (dim3 & 0xFF) << 24 | (dim2 & 0xFF) << 16 | (dim1 & 0xFF) << 8 | (baseColour & 0xFF);
    }
}
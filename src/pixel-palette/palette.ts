import Colour from "./colour";

type ColourMap = { [baseColour: number]: Colour }
export default class Palette
{
    colours: ColourMap = {};
    numberOfBaseColours: number;
    dim1Size: number;
    dim2Size: number;
    dim3Size: number;

    constructor(numBaseColours: number, dim1Size: number = 1, dim2Size: number = 1, dim3Size: number = 1)
    {
        this.numberOfBaseColours = numBaseColours;
        this.dim1Size = dim1Size;
        this.dim2Size = dim2Size;
        this.dim3Size = dim3Size;
    }

    getColour (baseColour: number, dim1: number = 0, dim2: number = 0, dim3: number = 0): Colour
    {
        const index = (dim3 & 0xFF) << 24 | (dim2 & 0xFF) << 16 | (dim1 & 0xFF) << 8 | (baseColour & 0xFF);
        let result = this.colours[index];
        if (result)
        {
            return result;
        }

        if (dim1 !== 0 && dim2 !== 0 && dim3 !== 0)
        {
            result = this.colours[baseColour & 0xFF];
        }

        return result ? result : Colour.empty;
    }

    setColour (colour: Colour, baseColour: number, dim1: number = 0, dim2: number = 0, dim3: number = 0)
    {
        const index = (dim3 & 0xFF) << 24 | (dim2 & 0xFF) << 16 | (dim1 & 0xFF) << 8 | (baseColour & 0xFF);
        this.colours[index] = colour;
    }
}
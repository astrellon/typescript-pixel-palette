import Colour from "./colour";
import Vector3 from "./vector3";

type ColourMap = { [baseColour: number]: Colour }

function randomColour(): number
{
    return Math.floor(Math.random() * 256.0);
}

export default class Palette
{
    colours: ColourMap = {};
    numberOfBaseColours: number;
    dimSizes: Vector3;

    constructor(numBaseColours: number, dim1Size: number = 1, dim2Size: number = 1, dim3Size: number = 1)
    {
        this.numberOfBaseColours = numBaseColours;
        this.dimSizes = new Vector3(dim1Size, dim2Size, dim3Size);
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
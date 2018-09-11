import Palette from "./palette";
import ColourSerialiser from "./colourSerialiser";

export default class PaletteSerialiser
{
    static serialiseJson(palette: Palette)
    {
        const colours = {};
        for (let key in palette.colours)
        {
            colours[key] = ColourSerialiser.serialiseJson(palette.colours[key]);
        }

        const result = {
            'numOfBaseColours': palette.numberOfBaseColours,
            'dim1Size': palette.dim1Size,
            'dim2Size': palette.dim2Size,
            'dim3Size': palette.dim3Size,
            'colours': colours
        };

        return result;
    }
}
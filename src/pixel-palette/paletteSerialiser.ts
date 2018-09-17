import ColourSerialiser from "./colourSerialiser";
import { PaletteState } from "./store/pixelStore";

export default class PaletteSerialiser
{
    static serialiseJson(palette: PaletteState)
    {
        const colours = {};
        for (let key in palette.colourMap)
        {
            colours[key] = ColourSerialiser.serialiseJson(palette.colourMap[key]);
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
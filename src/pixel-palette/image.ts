import Palette from "./palette";

export default class Image
{
    width: number;
    height: number;
    pixelIndices: number[];
    palette: Palette;

    constructor(width: number, height: number, pixelIndices: number[], palette: Palette)
    {
        this.width = width;
        this.height = height;
        this.pixelIndices = pixelIndices;
        this.palette = palette;
    }

    setPixel(x: number, y: number, pixel: number)
    {
        this.pixelIndices[y * this.width + x] = pixel;
    }
}
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

    render(canvas: HTMLCanvasElement, dim1Offset: number = 0, dim2Offset: number = 0, dim3Offset: number = 0)
    {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let i = 0;
        for (let y = 0; y < this.height; y++)
        for (let x = 0; x < this.width; x++)
        {
            let index = this.pixelIndices[i++];
            const colour = this.palette.getColour(index, dim1Offset, dim2Offset, dim3Offset);

            ctx.fillStyle = `rgb(${colour.red}, ${colour.green}, ${colour.blue})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
}
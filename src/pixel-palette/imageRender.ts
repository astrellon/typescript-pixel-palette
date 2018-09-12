import Image from "./image";
import { create } from "./htmlHelper";
import './image.scss';

export default class ImageRender
{
    image: Image;
    el: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(image: Image)
    {
        this.image = image;
        this.render();
    }

    render()
    {
        this.el = create('div', 'image');
        this.canvas = create('canvas');
        this.el.appendChild(this.canvas);

        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;
        
        this.ctx = this.canvas.getContext('2d');
    }
    
    update(dim1Offset: number = 0, dim2Offset: number = 0, dim3Offset: number = 0)
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let i = 0;
        for (let y = 0; y < this.image.height; y++)
        for (let x = 0; x < this.image.width; x++)
        {
            let index = this.image.pixelIndices[i++];
            const colour = this.image.palette.getColour(index, dim1Offset, dim2Offset, dim3Offset);

            this.ctx.fillStyle = colour.toRgbString();
            this.ctx.fillRect(x, y, 1, 1);
        }
    }
}
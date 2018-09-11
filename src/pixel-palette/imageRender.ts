import Image from "./image";
import { create } from "./htmlHelper";

interface Position
{
    x: number;
    y: number;
}

let prevPos: Position = {x: 0, y: 0}
let isMouseDown = false;

document.body.addEventListener('mouseup', (e) =>
    {
        isMouseDown = false;
    });

export default class ImageRender
{
    image: Image;
    el: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scale: number = 20;

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

        this.canvas.width = this.image.width * 20;
        this.canvas.height = this.image.height * 20;
        
        this.ctx = this.canvas.getContext('2d');

        this.ctx.scale(this.scale, this.scale);
        this.ctx.strokeStyle = 'black';

        this.canvas.addEventListener('mousedown', (e) => { this.onMouseDown(e); });
        this.canvas.addEventListener('mousemove', (e) => { this.onMouseMove(e); });
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

    getCanvasPosition(e: MouseEvent): Position
    {
        const rect = this.canvas.getBoundingClientRect();
        const posX = Math.floor((e.clientX - rect.left) / this.scale);
        const posY = Math.floor((e.clientY - rect.top) / this.scale);

        return { x: posX, y: posY };
    }

    onMouseDown(e: MouseEvent)
    {
        prevPos = this.getCanvasPosition(e);
        isMouseDown = true;
    }

    onMouseMove(e: MouseEvent)
    {
        if (!isMouseDown)
        {
            return;
        }

        const pos = this.getCanvasPosition(e);

        const dx = Math.abs(pos.x - prevPos.x);
        const dy = Math.abs(pos.y - prevPos.y);

        const sx = prevPos.x < pos.x ? 1 : -1;
        const sy = prevPos.y < pos.y ? 1 : -1;

        let err = dx - dy;
        let e2;
        let currentX = prevPos.x;
        let currentY = prevPos.y;

        while (true)
        {
            this.image.setPixel(currentX, currentY, 1);

            if (currentX === pos.x && currentY === pos.y)
            {
                break;
            }

            e2 = 2 * err;
            if (e2 > -1 * dy)
            {
                err = err - dy;
                currentX = currentX + sx;
            }

            if (e2 < dx)
            {
                err = err + dx;
                currentY = currentY + sy;
            }
        }

        prevPos = pos;
    }
}
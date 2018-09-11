import 'milligram/dist/milligram.css';
import Palette from './pixel-palette/palette';
import Image from './pixel-palette/image';
import Colour from './pixel-palette/colour';
import PaletteRender from './pixel-palette/paletteRender';

interface Position
{
    x: number;
    y: number;
}

const canvas = document.getElementById('editor') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const scale = 10;
ctx.scale(scale, scale);
ctx.strokeStyle = 'black';

let prevPos: Position = {x: 0, y: 0}
let isMouseDown = false;

const palette = new Palette(4, 3);
palette.setColour(new Colour(255, 0, 0), 0);
palette.setColour(new Colour(0, 255, 0), 1);
palette.setColour(new Colour(0, 0, 255), 2);
palette.setColour(new Colour(255, 255, 255), 3);

palette.setColour(new Colour(127, 0, 0), 0, 1);
palette.setColour(new Colour(0, 127, 0), 1, 1);
palette.setColour(new Colour(0, 0, 127), 2, 1);
palette.setColour(new Colour(127, 127, 127), 3, 1);

palette.setColour(new Colour(88, 0, 0), 0, 2);
palette.setColour(new Colour(0, 88, 0), 1, 2);
palette.setColour(new Colour(0, 0, 88), 2, 2);
palette.setColour(new Colour(88, 88, 88), 3, 2);

const image = new Image(4, 4, [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3], palette);
const paletteRender = new PaletteRender(palette);
document.body.appendChild(paletteRender.el);

let offset = 0;

function animate()
{
    image.render(canvas, offset);
    offset++;
    if (offset >= palette.dim1Size)
    {
        offset = 0;
    }
    setTimeout(animate, 500);
}
animate();

function getCanvasPosition(e: MouseEvent): Position
{
    const rect = canvas.getBoundingClientRect();
    const posX = Math.floor((e.clientX - rect.left) / scale);
    const posY = Math.floor((e.clientY - rect.top) / scale);

    return { x: posX, y: posY };
}

document.body.addEventListener('mouseup', (e) =>
    {
        isMouseDown = false;
    });

canvas.addEventListener('mousedown', (e) =>
    {
        prevPos = getCanvasPosition(e);
        isMouseDown = true;
    });

canvas.addEventListener('mousemove', (e) =>
    {
        if (!isMouseDown)
        {
            return;
        }

        const pos = getCanvasPosition(e);

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
            ctx.fillRect(currentX, currentY, 1, 1);

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
    });
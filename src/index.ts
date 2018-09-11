import 'milligram/dist/milligram.css';
import Palette from './pixel-palette/palette';
import Image from './pixel-palette/image';
import Colour from './pixel-palette/colour';
import PaletteRender from './pixel-palette/paletteRender';
import ImageRender from './pixel-palette/imageRender';

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
const imageRender = new ImageRender(image);
const paletteRender = new PaletteRender(palette);
document.body.appendChild(imageRender.el);
document.body.appendChild(paletteRender.el);

let offset = 0;

function animate()
{
    imageRender.update(offset);
    offset++;
    if (offset >= palette.dim1Size)
    {
        offset = 0;
    }
    setTimeout(animate, 500);
}
animate();
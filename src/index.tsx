import 'milligram/dist/milligram.css';
import './style.scss';

import Colour from './pixel-palette/colour';
import Palette from './pixel-palette/palette';
import PaletteRender from './pixel-palette/paletteRender';
import PaletteSerialiser from './pixel-palette/paletteSerialiser';
import Image from './pixel-palette/image';
import ImageRender from './pixel-palette/imageRender';
import ImageSerialiser from './pixel-palette/imageSerialiser';
import { create } from './pixel-palette/htmlHelper';
import EditView from './pixel-palette/editView';
import PaintingTool from './pixel-palette/paintingTool';
import PaletteRender2 from './pixel-palette/paletteRender2';
import React from 'react';
import ReactDOM from 'react-dom';

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

ReactDOM.render(
    <div>
        <h1>Pixel Palette</h1>
        <PaletteRender2 palette={palette} />
    </div>,
    document.getElementById('root');
);

/*
const saveEl = create('button');
saveEl.innerText = 'Save';
document.body.appendChild(saveEl);
saveEl.addEventListener('click', () =>
{
    var paletteJson = JSON.stringify(PaletteSerialiser.serialiseJson(palette));
    var imageJson = JSON.stringify(ImageSerialiser.serialiseJson(image));
    console.log('Palette', paletteJson, paletteJson.length, 'Image', imageJson, imageJson.length);
});

const imageRender = new ImageRender(image);
const paletteRender = new PaletteRender(palette);
const editView = new EditView();
editView.setImage(imageRender);

const paintingTool = new PaintingTool();
editView.currentTool = paintingTool;

document.body.appendChild(editView.el);
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
*/
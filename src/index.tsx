import 'milligram/dist/milligram.css';
import './style.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import Colour from './pixel-palette/colour';
import Palette from './pixel-palette/palette';
import PaletteSerialiser from './pixel-palette/paletteSerialiser';
import Image from './pixel-palette/image';
import ImageSerialiser from './pixel-palette/imageSerialiser';
import PaintingTool from './pixel-palette/paintingTool';
import EditView from './pixel-palette/editView';

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
const paintingTool = new PaintingTool();

ReactDOM.render(
    <div>
        <h1>Pixel Palette</h1>
        <EditView image={image} palette={palette} currentTool={paintingTool}/>
        <button onClick={() =>
            {
                console.log('Palette', PaletteSerialiser.serialiseJson(palette));
                console.log('Image', ImageSerialiser.serialiseJson(image));
            }}>Save</button>
    </div>,
    document.getElementById('root')
);
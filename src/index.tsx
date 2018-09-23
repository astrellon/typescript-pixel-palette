import 'milligram/dist/milligram.css';
import './style.scss';
import './color-picker.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import PaletteSerialiser from './pixel-palette/paletteSerialiser';
import ImageSerialiser from './pixel-palette/imageSerialiser';
import PaintingTool from './pixel-palette/paintingTool';
import EditView from './pixel-palette/editView';
import { store } from './pixel-palette/store/pixelStore';
import { UpdateColour } from './pixel-palette/store/updateColour';
import { ResizeImage } from './pixel-palette/store/resizeImage';
import { SetPixels } from './pixel-palette/store/setPixels';
import { ResizePalette } from './pixel-palette/store/resizePalette';

const paintingTool = new PaintingTool();

store.dispatch(ResizePalette.action({numberOfBaseColours: 4}));
store.dispatch(UpdateColour.action(0, {red: 255, green: 0, blue: 0, alpha: 255}));
store.dispatch(UpdateColour.action(1, {red: 0, green: 255, blue: 0, alpha: 255}));
store.dispatch(UpdateColour.action(2, {red: 0, green: 0, blue: 255, alpha: 255}));
store.dispatch(UpdateColour.action(3, {red: 255, green: 255, blue: 255, alpha: 255}));
store.dispatch(ResizeImage.action(5, 5));
store.dispatch(SetPixels.action(1, 1, 3, 3, [1, 2, 3, 2, 3, 1, 3, 1, 2]));

store.subscribeAny(render);

function render(state)
{
    ReactDOM.render(
        <div>
            <h1>Pixel Palette</h1>
            <EditView image={state.image} palette={state.palette} currentTool={paintingTool} />
            <button onClick={() =>
            {
                console.log('Palette', PaletteSerialiser.serialiseJson(state.palette));
                console.log('Image', ImageSerialiser.serialiseJson(state.image));
            }}>Save</button>
        </div>,
        document.getElementById('root')
    );
}
render(store.currentState);
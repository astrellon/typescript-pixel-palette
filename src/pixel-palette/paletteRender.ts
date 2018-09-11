import Palette from "./palette";
import './palette.scss';
import { create, createInput } from "./htmlHelper";
import Colour from "./colour";

export default class PaletteRender
{
    palette: Palette;
    baseColours: { [index: number]: HTMLElement} = {};
    el: HTMLElement;

    dim1Offset: number = 0;
    dim2Offset: number = 0;
    dim3Offset: number = 0;

    constructor (palette: Palette)
    {
        this.palette = palette;
        this.el = document.createElement('div');
        this.el.classList.add('palette');

        const dim1Slider = createInput('range');
        dim1Slider.min = '0';
        dim1Slider.max = `${this.palette.dim1Size - 1}`;
        dim1Slider.value = '0';
        dim1Slider.addEventListener('change', () => {this.dim1Offset = parseInt(dim1Slider.value); this.update();});
        this.el.appendChild(dim1Slider);
        
        const dim2Slider = createInput('range');
        dim2Slider.min = '0';
        dim2Slider.max = `${this.palette.dim2Size - 1}`;
        dim2Slider.value = '0';
        dim2Slider.addEventListener('change', () => {this.dim2Offset = parseInt(dim2Slider.value); this.update();});
        this.el.appendChild(dim2Slider);
        
        const dim3Slider = createInput('range');
        dim3Slider.min = '0';
        dim3Slider.max = `${this.palette.dim3Size - 1}`;
        dim3Slider.value = '0';
        dim3Slider.addEventListener('change', () => {this.dim3Offset = parseInt(dim3Slider.value); this.update();});
        this.el.appendChild(dim3Slider);

        this.render();
    }

    render()
    {
        for (let i = 0; i < 256; i++)
        {
            const colour = this.palette.getColour(i, this.dim1Offset, this.dim2Offset, this.dim3Offset);
            const colourEl = create('label', 'palette__colour');

            const inputEl = create('input');
            inputEl.type = 'color';
            colourEl.appendChild(inputEl);

            inputEl.addEventListener('change', (e) =>
            {
                colourEl.style.backgroundColor = inputEl.value;
                const red = Number.parseInt(inputEl.value.substr(1, 2), 16);
                const green = Number.parseInt(inputEl.value.substr(3, 2), 16);
                const blue = Number.parseInt(inputEl.value.substr(5, 2), 16);

                colour.red = red;
                colour.green = green;
                colour.blue = blue;
            });

            this.baseColours[i] = colourEl;

            this.updateItem(i, colour);

            this.el.appendChild(colourEl);
        }
    }

    update()
    {
        for (let i = 0; i < 256; i++)
        {
            const colour = this.palette.getColour(i, this.dim1Offset, this.dim2Offset, this.dim3Offset);
            this.updateItem(i, colour);
        }
    }

    updateItem(index: number, colour: Colour)
    {
        const colourEl = this.baseColours[index];

        colourEl.style.backgroundColor = `rgb(${colour.red}, ${colour.green}, ${colour.blue})`;

        const inputEl = colourEl.querySelector('input');
        inputEl.value = `#${colour.toHexString()}`;
    }
}
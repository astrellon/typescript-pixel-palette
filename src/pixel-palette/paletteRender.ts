import Palette from "./palette";
import './palette.scss';

export default class PaletteRender
{
    palette: Palette;
    baseColours: { [index: number]: HTMLElement} = {};
    el: HTMLElement;

    constructor (palette: Palette)
    {
        this.palette = palette;
        this.el = document.createElement('div');
        this.el.classList.add('palette');

        this.render();
    }

    render()
    {
        for (let i = 0; i < 256; i++)
        {
            const colour = this.palette.getColour(i);
            const colourEl = document.createElement('label');
            colourEl.classList.add('palette__colour');
            colourEl.style.backgroundColor = `rgb(${colour.red}, ${colour.green}, ${colour.blue})`;

            const inputEl = document.createElement('input');
            inputEl.type = 'color';
            inputEl.value = `#${colour.toHexString()}`;
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

            this.el.appendChild(colourEl);
        }
    }
}
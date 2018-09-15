import Palette, { UpdateCallback, doNothing } from "./palette";
import React, { ChangeEvent } from "react";
import Colour from "./colour";

import './palette.scss';

interface Props
{
    palette: Palette,
    dim1Offset?: number,
    dim2Offset?: number,
    dim3Offset?: number,
    onUpdate?: UpdateCallback
}

interface State
{
}

interface ColourProps
{
    //colour: Colour
    palette: Palette,
    index: number
}

class PaletteColour extends React.PureComponent<ColourProps>
{
    input: HTMLInputElement;

    componentDidMount()
    {
        this.input.addEventListener('change', (e: any) =>
            {
                const value = e.target.value;
                e.target.parentElement.style.backgroundColor = value;

                const red = Number.parseInt(value.substr(1, 2), 16);
                const green = Number.parseInt(value.substr(3, 2), 16);
                const blue = Number.parseInt(value.substr(5, 2), 16);

                const newColour = new Colour(red, green, blue, 255);
                this.props.palette.setColourIndex(newColour, this.props.index);
            });
    }

    render()
    {
        const colour = this.props.palette.getColourIndex(this.props.index);
        return <label className="palette__colour" style={{backgroundColor: colour.toRgbString()}}>
                <input type="color" defaultValue={'#' + colour.toHexString()} ref={node => this.input = node} />
            </label>
    }
}

export default class PaletteRender extends React.Component<Props, State>
{
    static defaultProps: Props = {
        palette: null,
        dim1Offset: 0,
        dim2Offset: 0,
        dim3Offset: 0,
    }

    constructor(props: Props)
    {
        super(props);
    }

    componentDidUpdate()
    {
        if (this.props.onUpdate)
        {
            this.props.palette.onUpdateCallback = this.props.onUpdate;
        }
        else
        {
            this.props.palette.onUpdateCallback = doNothing;
        }
    }

    renderColours(): JSX.Element[]
    {
        const result = [];

        for (let i = 0; i < 256; i++)
        {
            if (this.props.palette.hasBaseColour(i))
            {
                const index = Palette.makeIndex(i, this.props.dim1Offset, this.props.dim2Offset, this.props.dim3Offset);
                result.push(<PaletteColour key={index} palette={this.props.palette} index={index} />);
            }
        }

        return result;
    }

    render()
    {
           return (
               <div>
                { this.renderColours() }
               </div>
           )
    }
}
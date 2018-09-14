import Palette from "./palette";
import React, { ChangeEvent } from "react";
import Colour from "./colour";

import './palette.scss';

interface Props
{
    palette: Palette
}

interface State
{
    dim1Offset: number,
    dim2Offset: number,
    dim3Offset: number,
}

interface ColourProps
{
    colour: Colour
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

                this.props.colour.red = red;
                this.props.colour.green = green;
                this.props.colour.blue = blue;
            });
    }

    render()
    {
        return <label className="palette__colour" style={{backgroundColor: this.props.colour.toRgbString()}}>
                <input type="color" defaultValue={'#' + this.props.colour.toHexString()} ref={node => this.input = node} />
            </label>
    }
}

export default class PaletteRender2 extends React.Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state = {
            dim1Offset: 0,
            dim2Offset: 0,
            dim3Offset: 0,
        };
    }

    handleDimOffset(event: ChangeEvent<HTMLInputElement>, prop: string)
    {
        this.setState({...this.state, [prop]: parseInt(event.target.value)});
    }

    renderColours(): JSX.Element[]
    {
        const result = [];

        for (let i = 0; i < 256; i++)
        {
            if (this.props.palette.hasBaseColour(i))
            {
                result.push(<PaletteColour key={i} colour={this.props.palette.getColour(i, this.state.dim1Offset, this.state.dim2Offset, this.state.dim3Offset)} />);
            }
        }

        return result;
    }

    render()
    {
        return <div>
                <label>
                    Dim 1 Offset
                    <input type="range" min="0" max={this.props.palette.dimSizes.x - 1} value={this.state.dim1Offset}
                        onChange={(e) => this.handleDimOffset(e, 'dim1Offset')} />
                </label>
                <label>
                    Dim 2 Offset
                    <input type="range" min="0" max={this.props.palette.dimSizes.y - 1} value={this.state.dim2Offset}
                        onChange={(e) => this.handleDimOffset(e, 'dim2Offset')} />
                </label>
                <label>
                    Dim 3 Offset
                    <input type="range" min="0" max={this.props.palette.dimSizes.z - 1} value={this.state.dim3Offset}
                        onChange={(e) => this.handleDimOffset(e, 'dim3Offset')} />
                </label>

                { this.renderColours() }

            </div>;
    }
}
import Palette, { UpdateCallback, doNothing } from "./palette";
import React, { ChangeEvent, MouseEventHandler } from "react";
import Colour from "./colour";

import './palette.scss';

export type SelectCallback = (baseColour: number) => void;

interface Props
{
    palette: Palette,
    dim1Offset?: number,
    dim2Offset?: number,
    dim3Offset?: number,
    onUpdate?: UpdateCallback,
    onSelect?: SelectCallback
}

interface State
{
}

interface ColourProps
{
    palette: Palette,
    index: number,
    onClick: MouseEventHandler<HTMLDivElement>
}

class PaletteColour extends React.PureComponent<ColourProps>
{
    input: HTMLInputElement;

    componentDidMount()
    {
        this.input.addEventListener('change', (e: any) =>
            {
                const value = e.target.value;
                (this.refs.preview as HTMLElement).style.backgroundColor = value;

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
        const style = {
            backgroundColor: colour.toRgbString()
        };
        
        return <div className="palette-colour" style={style} onClick={(e) => this.props.onClick(e)}>
                <div ref="preview" className="palette-colour__preview" style={{backgroundColor: colour.toRgbString()}}></div>
                <label className="palette-colour__prefs">
                    <input type="color" defaultValue={'#' + colour.toHexString()} ref={node => this.input = node} />
                </label>
            </div>
    }
}

export default class PaletteRender extends React.Component<Props, State>
{
    static defaultProps: Props = {
        palette: null,
        dim1Offset: 0,
        dim2Offset: 0,
        dim3Offset: 0,
        onSelect: function(e) {}
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
                result.push(
                    <PaletteColour 
                        key={index} 
                        palette={this.props.palette} 
                        index={index} 
                        onClick={(e) => {this.props.onSelect(i)}}
                        />);
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
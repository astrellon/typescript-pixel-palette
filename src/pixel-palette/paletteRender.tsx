import React, { ChangeEvent, MouseEventHandler } from "react";

import './palette.scss';
import { PaletteState, store, toRgbString, toHexString } from "./store/pixelStore";
import { UpdateColour } from "./store/updateColour";
import Palette from "./palette";

export type SelectCallback = (baseColour: number) => void;

interface Props
{
    palette: PaletteState,
    dim1Offset?: number,
    dim2Offset?: number,
    dim3Offset?: number,
    onSelect?: SelectCallback
}

interface State
{
}

interface ColourProps
{
    palette: PaletteState,
    index: number,
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

                const newColour = {red, green, blue, alpha: 255};
                store.dispatch(UpdateColour.action(this.props.index, newColour))
            });
    }

    render()
    {
        const colour = this.props.palette.colourMap[this.props.index];
        const style = {
            backgroundColor: toRgbString(colour)
        };
        
        return <div className="palette-colour" style={style} data-index={this.props.index}>
                <div ref="preview" className="palette-colour__preview"></div>
                <label className="palette-colour__prefs">
                    <input type="color" defaultValue={'#' + toHexString(colour)} ref={node => this.input = node} />
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

    renderColours(): JSX.Element[]
    {
        const result = [];

        for (let i = 0; i < 256; i++)
        {
            if (this.props.palette.colourMap[i])
            {
                const index = Palette.makeIndex(i, this.props.dim1Offset, this.props.dim2Offset, this.props.dim3Offset);
                result.push(
                    <PaletteColour 
                        key={index} 
                        palette={this.props.palette} 
                        index={index} 
                        />);
            }
        }

        return result;
    }

    render()
    {
           return (
               <div onClick={(e) => console.log((e.target as HTMLElement).closest('.palette-colour'))}>
                { this.renderColours() }
               </div>
           )
    }
}
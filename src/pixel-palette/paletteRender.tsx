import React, { ChangeEvent, MouseEventHandler, ReactElement } from "react";
import ColorPicker from "react-simple-colorpicker";

import './palette.scss';
import { PaletteState, store, toRgbString, toHexString } from "./store/pixelStore";
import { UpdateColour } from "./store/updateColour";
import Palette from "./palette";
import * as PureColour from "pure-color";
import Colour from "./colour";

export type SelectCallback = (baseColour: number) => void;

export interface ColoursProps
{
    palette: PaletteState,
    dim1Offset: number,
    dim2Offset: number,
    dim3Offset: number,
    selectedIndex: number
}
export interface Props
{
    colourProps: ColoursProps,
    onSelect?: SelectCallback,
    editColours: boolean,
}

interface State
{
}

/*
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
                    <input type="color" defaultValue={`#${toHexString(colour)}`} ref={node => this.input = node} />
                </label>
            </div>
    }
}
*/

class PaletteColours extends React.PureComponent<ColoursProps>
{
    renderColours(): JSX.Element[]
    {
        const result = [];

        for (let i = 0; i < 256; i++)
        {
            if (this.props.palette.colourMap[i])
            {
                const index = Palette.makeIndex(i, this.props.dim1Offset, this.props.dim2Offset, this.props.dim3Offset);
                const colour = this.props.palette.colourMap[index];
                const style = {
                    backgroundColor: toRgbString(colour)
                };
                const className = 'palette-colour' + (this.props.selectedIndex === i ? ' palette-colour__selected' : '');

                result.push(<div key={index} className={className} style={style} data-index={index}>
                        <div ref="preview" className="palette-colour__preview"></div>
                    </div>);
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

export default class PaletteRender extends React.Component<Props, State>
{
    static defaultProps: Props = {
        colourProps: {
            palette: null,
            dim1Offset: 0,
            dim2Offset: 0,
            dim3Offset: 0,
            selectedIndex: 0
        },
        onSelect: function(e) {},
        editColours: false
    }

    onPaletteClick(event: React.MouseEvent<HTMLElement>)
    {
        const target = (event.target as HTMLElement).closest('.palette-colour');
        if (target == null)
        {
            return;
        }
        const index = parseInt(target.attributes["data-index"].value);
        this.props.onSelect(index);
    }

    renderColourPicker(): JSX.Element
    {
        const colourProps = this.props.colourProps;
        const index = Palette.makeIndex(colourProps.selectedIndex, colourProps.dim1Offset, colourProps.dim2Offset, colourProps.dim3Offset);

        const colour = this.props.colourProps.palette.colourMap[index];

        return <ColorPicker onChange={(result) => {
            const parsed = PureColour.parse(result);
            const newColour = new Colour(parsed[0], parsed[1], parsed[2], Math.floor(parsed[3] * 256));
            store.dispatch(UpdateColour.action(index, newColour));
        }} color={`#${toHexString(colour)}`} alpha={colour.alpha} opacitySlider /> 
    }

    render()
    {
        const colourProps = this.props.colourProps;
        return (
            <div>
                { this.props.editColours ? 
                    this.renderColourPicker() 
                    : null 
                }
                <div onClick={(e) => this.onPaletteClick(e)}>
                    <PaletteColours 
                        ref="colours"
                        palette={colourProps.palette} 
                        dim1Offset={colourProps.dim1Offset} 
                        dim2Offset={colourProps.dim2Offset} 
                        dim3Offset={colourProps.dim3Offset} 
                        selectedIndex={colourProps.selectedIndex}
                        />
                </div>
            </div>
        );
    }
}
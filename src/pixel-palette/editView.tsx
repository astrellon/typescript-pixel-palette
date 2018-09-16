import React, { ChangeEvent, MouseEvent } from "react";
import Image from "./image";
import Palette from "./palette";
import ImageRender from "./imageRender";
import PaletteRender from "./paletteRender";
import EditTool from "./editTool";
import { ImageState, PaletteState } from "./store/pixelStore";

export interface Position
{
    x: number;
    y: number;
}

interface Props
{
    image: ImageState,
    palette: PaletteState,
    currentTool: EditTool,
}
interface State
{
    dim1Offset: number,
    dim2Offset: number,
    dim3Offset: number,
    zoom: number
}

export default class EditView extends React.Component<Props, State>
{
    prevPos: Position = {x:0, y:0}
    mouseDownPos: Position = {x:0, y:0}
    isMouseDown: boolean = false;
    selectedColour: number = 0;

    constructor(props)
    {
        super(props);

        this.state = {
            dim1Offset: 0,
            dim2Offset: 0,
            dim3Offset: 0,
            zoom: 20
        }
    }

    handleDimOffset(event: ChangeEvent<HTMLInputElement>, prop: string)
    {
        this.setState({...this.state, [prop]: parseInt(event.target.value)});
    }
    
    getCanvasPosition(e: MouseEvent<HTMLElement>): Position
    {
        const rect = (this.refs.editImage as HTMLElement).getBoundingClientRect();
        const posX = Math.floor((e.clientX - rect.left) / this.state.zoom);
        const posY = Math.floor((e.clientY - rect.top) / this.state.zoom);

        return { x: posX, y: posY };
    }

    onMouseDown(event: MouseEvent<HTMLElement>)
    {
        const pos = this.getCanvasPosition(event);
        this.prevPos = pos;
        this.mouseDownPos = pos;
        this.isMouseDown = true;
        
        if (this.props.currentTool != null)
        {
            this.props.currentTool.onMouseDown(this, pos);
            this.forceUpdate();
        }
    }

    onMouseMove(event: MouseEvent<HTMLElement>)
    {
        const pos = this.getCanvasPosition(event);

        if (this.props.currentTool != null)
        {
            this.props.currentTool.onMouseMove(this, this.isMouseDown, this.prevPos, pos);
            this.forceUpdate();
        }

        this.prevPos = pos;
    }
    
    onMouseUp(event: MouseEvent<HTMLElement>)
    {
        const pos = this.getCanvasPosition(event);
        this.prevPos = pos;
        this.isMouseDown = false;
        
        if (this.props.currentTool != null)
        {
            this.props.currentTool.onMouseUp(this, this.mouseDownPos, pos);
            this.forceUpdate();
        }
    }

    selectColour(baseColour: number)
    {
        this.selectedColour = baseColour;
    }

    render()
    {
        return <div className="edit-view">
                <div ref="editImage" className="edit-view__contents" 
                    onMouseDown={(e) => this.onMouseDown(e)}
                    onMouseMove={(e) => this.onMouseMove(e)}
                    onMouseUp={(e) => this.onMouseUp(e)} >

                    <ImageRender image={this.props.image}  palette={this.props.palette} dim1Offset={this.state.dim1Offset} dim2Offset={this.state.dim2Offset} dim3Offset={this.state.dim3Offset}/>
                </div>

                <label>
                    Dim 1 Offset
                    <input type="range" min="0" max={this.props.palette.dim1Size - 1} value={this.state.dim1Offset}
                        onChange={(e) => this.handleDimOffset(e, 'dim1Offset')} />
                </label>
                <label>
                    Dim 2 Offset
                    <input type="range" min="0" max={this.props.palette.dim2Size - 1} value={this.state.dim2Offset}
                        onChange={(e) => this.handleDimOffset(e, 'dim2Offset')} />
                </label>
                <label>
                    Dim 3 Offset
                    <input type="range" min="0" max={this.props.palette.dim3Size - 1} value={this.state.dim3Offset}
                        onChange={(e) => this.handleDimOffset(e, 'dim3Offset')} />
                </label>

                <PaletteRender palette={this.props.palette} 
                    dim1Offset={this.state.dim1Offset} 
                    dim2Offset={this.state.dim2Offset} 
                    dim3Offset={this.state.dim3Offset}
                    onUpdate={() => this.forceUpdate()} 
                    onSelect={(baseColour) => this.selectColour(baseColour)}
                    />
            </div>
    }
}
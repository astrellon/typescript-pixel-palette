import React, { ChangeEvent, MouseEvent } from "react";
import ImageRender from "./imageRender";
import PaletteRender, { ColoursProps } from "./paletteRender";
import EditTool from "./editTool";
import { ImageState, PaletteState, store, ColourState } from "./store/pixelStore";
import { ResizePalette } from "./store/resizePalette";
import { ImageTransaction } from "./store/imageTransaction";
import { UpdateColour } from "./store/updateColour";

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
    zoom: number,
    paletteEditMode: boolean,
    selectedIndex: number
}

function randColour(): number
{
    return Math.floor(Math.random() * 256.0);
}

export default class EditView extends React.Component<Props, State>
{
    prevPos: Position = {x:0, y:0}
    mouseDownPos: Position = {x:0, y:0}
    isMouseDown: boolean = false;

    constructor(props)
    {
        super(props);

        this.state = {
            dim1Offset: 0,
            dim2Offset: 0,
            dim3Offset: 0,
            zoom: 20,
            paletteEditMode: false,
            selectedIndex: 0
        }

        document.body.addEventListener('keydown', (e) =>
            {
                if (e.which === 27)
                {
                    store.dispatch(ImageTransaction.cancel());
                    this.endMouse();
                }
            })
    }

    handleDimOffset(event: ChangeEvent<HTMLInputElement>, prop: string)
    {
        this.setState({...this.state, [prop]: parseInt(event.target.value)});
    }

    resizePalette(prop: string, diff: number)
    {
        const currentValue: number = this.props.palette[prop];
        store.dispatch(ResizePalette.action({[prop]: currentValue + diff}));
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
        if (!this.isMouseDown)
        {
            return;
        }

        const pos = this.getCanvasPosition(event);
        this.prevPos = pos;
        this.endMouse();

        if (this.props.currentTool != null)
        {
            this.props.currentTool.onMouseUp(this, this.mouseDownPos, pos);
            this.forceUpdate();
        }
    }

    endMouse()
    {
        this.isMouseDown = false;
    }

    selectColour(baseColour: number)
    {
        this.setState({...this.state, selectedIndex: baseColour});
    }

    togglePaletteEdit()
    {
        this.setState({...this.state, paletteEditMode: !this.state.paletteEditMode});
    }

    addPaletteColour()
    {
        const numColours = this.props.palette.numberOfBaseColours + 1;
        store.dispatch(ResizePalette.action({numberOfBaseColours: numColours}));

        const newColour: ColourState = {
            red: randColour(),
            green: randColour(),
            blue: randColour(),
            alpha: 255
        }
        store.dispatch(UpdateColour.action(numColours, newColour));
    }

    render()
    {
        const colourProps: ColoursProps = {
            palette: this.props.palette,
            dim1Offset: this.state.dim1Offset,
            dim2Offset: this.state.dim2Offset,
            dim3Offset: this.state.dim3Offset,
            selectedIndex: this.state.selectedIndex
        }

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
                    <button onClick={(e) => this.resizePalette('dim1Size', 1)}> +1 </button>
                    <button onClick={(e) => this.resizePalette('dim1Size', -1)}> -1 </button>
                </label>
                <label>
                    Dim 2 Offset
                    <input type="range" min="0" max={this.props.palette.dim2Size - 1} value={this.state.dim2Offset}
                        onChange={(e) => this.handleDimOffset(e, 'dim2Offset')} />
                    <button onClick={(e) => this.resizePalette('dim2Size', 1)}> +1 </button>
                    <button onClick={(e) => this.resizePalette('dim2Size', -1)}> -1 </button>
                </label>
                <label>
                    Dim 3 Offset
                    <input type="range" min="0" max={this.props.palette.dim3Size - 1} value={this.state.dim3Offset}
                        onChange={(e) => this.handleDimOffset(e, 'dim3Offset')} />
                    <button onClick={(e) => this.resizePalette('dim3Size', 1)}> +1 </button>
                    <button onClick={(e) => this.resizePalette('dim3Size', -1)}> -1 </button>
                </label>

                <button onClick={() => this.togglePaletteEdit()}>Toggle Palette Edit</button>
                <button onClick={() => this.addPaletteColour()}>Add Colour</button>
                <PaletteRender
                    colourProps={colourProps}
                    onSelect={(baseColour) => this.selectColour(baseColour)}
                    editColours={this.state.paletteEditMode}
                    />
            </div>
    }
}
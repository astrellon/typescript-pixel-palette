import React from "react";
import Image from "./image";
import "./image.scss";
import { ImageState, PaletteState, toRgbString } from "./store/pixelStore";
import Palette from "./palette";
import Colour from "./colour";

interface Props
{
    image: ImageState,
    palette: PaletteState,
    dim1Offset?: number,
    dim2Offset?: number,
    dim3Offset?: number,
    zoom?: number,
}
interface State
{
}

export default class ImageRender extends React.Component<Props, State>
{
    static defaultProps: Props = {
        image: null,
        palette: null,
        dim1Offset: 0,
        dim2Offset: 0,
        dim3Offset: 0,
        zoom: 20
    }
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        this.update();
    }
    componentDidUpdate()
    {
        this.update();
    }

    render()
    {
        const image = this.props.image;
        const canvasStyle = {
            width: image.width * this.props.zoom,
            height: image.height * this.props.zoom
        }

        return <canvas className="image" 
                ref="canvas" 
                width={image.width} 
                height={image.height}
                style={canvasStyle}/>;
    }
    
    update()
    {
        const canvas = this.refs.canvas as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let i = 0;
        for (let y = 0; y < this.props.image.height; y++)
        for (let x = 0; x < this.props.image.width; x++)
        {
            const index = this.props.image.pixelIndices[i++];
            const paletteIndex = Palette.makeIndex(index, this.props.dim1Offset, this.props.dim2Offset, this.props.dim3Offset);
            const colour = this.props.palette.colourMap[paletteIndex] || this.props.palette[index] || {red: 255, green: 0, blue: 255, alpha: 255};

            ctx.fillStyle = toRgbString(colour);
            ctx.fillRect(x, y, 1, 1);
        }
    }
}
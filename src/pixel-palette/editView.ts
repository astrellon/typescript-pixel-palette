import { create } from "./htmlHelper";
import ImageRender from "./imageRender";
import EditTool from "./editTool";
import './editView.scss';

export interface Position
{
    x: number;
    y: number;
}

export default class EditView
{
    el: HTMLElement;
    contents: HTMLElement;
    imageRender: ImageRender;
    toolPreview: CanvasRenderingContext2D;
    toolPreviewCanvas: HTMLCanvasElement;
    zoom: number = 20;
    currentTool: EditTool;

    prevPos: Position = {x: 0, y: 0}
    isMouseDown = false;

    constructor()
    {
        this.el = create('div', 'edit-view');

        this.contents = create('div', 'edit-view__contents');
        this.el.appendChild(this.contents);

        this.toolPreviewCanvas = create('canvas', 'edit-view__preview');
        this.toolPreview = this.toolPreviewCanvas.getContext('2d');
        this.el.appendChild(this.toolPreviewCanvas);

        this.el.addEventListener('mousedown', (e) => { this.onMouseDown(e); });
        this.el.addEventListener('mousemove', (e) => { this.onMouseMove(e); });

        document.body.addEventListener('mouseup', (e) => { this.isMouseDown = false; });
    }

    setImage(image: ImageRender)
    {
        if (this.imageRender != null && this.contents.contains(this.imageRender.el))
        {
            this.contents.removeChild(this.imageRender.el);
            this.imageRender = null;

            if (this.toolPreviewCanvas != null)
            {
                this.toolPreviewCanvas.remove();
            }
        }

        this.imageRender = image;

        if (this.imageRender != null)
        {
            this.contents.appendChild(this.imageRender.el);

            this.toolPreviewCanvas.width = this.imageRender.image.width;
            this.toolPreviewCanvas.height = this.imageRender.image.height;
            
            this.updateZoom(this.zoom);
        }
    }

    setZoom(zoom: number)
    {
        if (this.zoom !== zoom)
        {
            this.zoom = zoom;
            this.updateZoom(zoom);
        }
    }

    setZoomOnEl(el: HTMLElement, width: number, height: number, zoom: number)
    {
        el.style.width = `${width * zoom}px`;
        el.style.height = `${height * zoom}px`;
    }

    updateZoom(zoom: number)
    {
        if (this.imageRender != null)
        {
            const width = this.imageRender.image.width;
            const height = this.imageRender.image.height;

            this.setZoomOnEl(this.imageRender.canvas, width, height, zoom);
            this.setZoomOnEl(this.toolPreviewCanvas, width, height, zoom);
            this.setZoomOnEl(this.el, width, height, zoom);
        }
    }

    getCanvasPosition(e: MouseEvent): Position
    {
        const rect = this.imageRender.el.getBoundingClientRect();
        const posX = Math.floor((e.clientX - rect.left) / this.zoom);
        const posY = Math.floor((e.clientY - rect.top) / this.zoom);

        return { x: posX, y: posY };
    }

    onMouseDown(e: MouseEvent)
    {
        this.prevPos = this.getCanvasPosition(e);
        this.isMouseDown = true;
            
        const pos = this.getCanvasPosition(e);
        
        if (this.currentTool != null)
        {
            this.currentTool.onMouseDown(this, pos);
        }
    }

    onMouseMove(e: MouseEvent)
    {
        const pos = this.getCanvasPosition(e);

        if (this.currentTool != null)
        {
            this.currentTool.onMouseMove(this, this.isMouseDown, this.prevPos, pos);
        }

        this.prevPos = pos;
    }
}
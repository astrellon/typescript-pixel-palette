import EditView, { Position } from "./editView";

export default interface EditTool
{
    onMouseDown: (editView: EditView, position: Position) => void;
    onMouseMove: (editView: EditView, isMouseDown: boolean, oldPosition: Position, currentPosition: Position) => void;
    onMouseUp: (editView: EditView, mouseDownPosition: Position, mouseUpPosition: Position) => void;
}
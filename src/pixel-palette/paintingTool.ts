import EditView, { Position } from "./editView";
import EditTool from "./editTool";
import { store } from "./store/pixelStore";
import { SetPixel } from "./store/setPixel";

export default class PaintingTool implements EditTool
{
    onMouseDown(editView: EditView, position: Position)
    {
        store.dispatch(SetPixel.action(position.x, position.y, editView.state.selectedIndex));
    }

    onMouseUp(editView: EditView, mouseDownPosition: Position, mouseUpPosition: Position)
    {

    }

    onMouseMove(editView: EditView, isMouseDown: boolean, oldPosition: Position, currentPosition: Position)
    {
        if (!isMouseDown)
        {
            return;
        }

        const dx = Math.abs(currentPosition.x - oldPosition.x);
        const dy = Math.abs(currentPosition.y - oldPosition.y);

        const sx = oldPosition.x < currentPosition.x ? 1 : -1;
        const sy = oldPosition.y < currentPosition.y ? 1 : -1;

        let err = dx - dy;
        let e2;
        let currentX = oldPosition.x;
        let currentY = oldPosition.y;

        while (true)
        {
            store.dispatch(SetPixel.action(currentX, currentY, editView.state.selectedIndex));

            if (currentX === currentPosition.x && currentY === currentPosition.y)
            {
                break;
            }

            e2 = 2 * err;
            if (e2 > -1 * dy)
            {
                err = err - dy;
                currentX = currentX + sx;
            }

            if (e2 < dx)
            {
                err = err + dx;
                currentY = currentY + sy;
            }
        }
    }
}
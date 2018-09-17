import { Action, Reducer } from "./store";
import { ColourState, State, ColourMap, PaletteState } from "./pixelStore";

export const UpdateColourActionType = 'UPDATE_COLOUR';
export interface UpdateColourAction extends Action
{
    index: number,
    colour: ColourState
}

export class UpdateColour extends Reducer<State>
{
    static action(index: number, colour: ColourState): UpdateColourAction
    {
        return {
            type: UpdateColourActionType,
            index, colour
        };
    }

    actionTypes = [UpdateColourActionType];

    execute(state: State, action: UpdateColourAction): State
    {
        const newColours: ColourMap = {...state.palette.colourMap, [action.index]: action.colour};
        const newPalette: PaletteState = {
            ...state.palette,
            colourMap: newColours
        }
        return {...state, palette: newPalette};
    }
}

import { ColourState, toHexAlphaString } from "./store/pixelStore";

export default class ColourSerialiser
{
    static serialiseJson(colour: ColourState)
    {
        return toHexAlphaString(colour);
    }
}
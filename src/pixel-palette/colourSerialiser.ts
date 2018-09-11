import Colour from "./colour";

export default class ColourSerialiser
{
    static serialiseJson(colour: Colour)
    {
        return colour.toHexAlphaString();
    }
}
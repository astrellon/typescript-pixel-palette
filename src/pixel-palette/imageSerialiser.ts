import Image from "./image";
import ColourSerialiser from "./colourSerialiser";

export default class ImageSerialiser
{
    static serialiseJson(image: Image)
    {
        const result = {
            'width': image.width,
            'height': image.height,
            'pixelIndices': image.pixelIndices
        }
        return result;
    }
}
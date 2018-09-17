import { ImageState } from "./store/pixelStore";

export default class ImageSerialiser
{
    static serialiseJson(image: ImageState)
    {
        const result = {
            'width': image.width,
            'height': image.height,
            'pixelIndices': image.pixelIndices
        }
        return result;
    }
}
function toHex(input: number)
{
    let result = input.toString(16);
    if (result.length < 2)
    {
        return `0${result}`;
    }
    return result;
}

export default class Colour
{
    public static readonly empty: Colour = new Colour(255, 0, 255, 127);

    public readonly red: number;
    public readonly green: number;
    public readonly blue: number;
    public readonly alpha: number;

    constructor(red: number = 0, green: number = 0, blue: number = 0, alpha: number = 0)
    {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    toHexString(): string
    {
        return toHex(this.red) + toHex(this.green) + toHex(this.blue);
    }
    toHexAlphaString(): string
    {
        return toHex(this.red) + toHex(this.green) + toHex(this.blue) + toHex(this.alpha);
    }
    toRgbString(): string
    {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }
}
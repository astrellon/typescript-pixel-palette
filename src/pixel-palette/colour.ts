export default class Colour
{
    public static readonly empty: Colour = new Colour(255, 0, 255, 127);

    public red: number;
    public green: number;
    public blue: number;
    public alpha: number;

    constructor(red: number = 0, green: number = 0, blue: number = 0, alpha: number = 0)
    {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}
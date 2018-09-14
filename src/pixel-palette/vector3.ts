export default class Vector3
{
    values: [number, number, number];

    get x(): number
    {
        return this.values[0];
    }

    get y(): number
    {
        return this.values[1];
    }

    get z(): number
    {
        return this.values[2];
    }

    constructor(x: number = 0, y: number = 0, z: number = 0)
    {
        this.values = [x,  y, z];
    }
}
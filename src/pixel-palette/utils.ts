export function set2dArrayImmutable<T>(input: ReadonlyArray<ReadonlyArray<T>>, x: number, y: number, value: T): T[][]
{
    const result = [...input] as T[][];
    let row: T[] = input[y] as T[];
    if (!row)
    {
        row = new Array<T>();
    }
    else
    {
        row = [...row];
    }

    result[y] = row;
    row[x] = value;

    return result;
}
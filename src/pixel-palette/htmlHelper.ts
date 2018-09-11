export function create<K extends keyof HTMLElementTagNameMap>(tagName: K, className: string = ''): HTMLElementTagNameMap[K]
{
    const el = document.createElement(tagName);
    el.className = className;
    return el;
}

export function createInput(type: string, className: string = ''): HTMLInputElement
{
    const el = create('input', className);
    el.type = type;
    return el;
}
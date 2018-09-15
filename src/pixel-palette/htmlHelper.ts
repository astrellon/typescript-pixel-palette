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

export function render(input: string): HTMLElement
{
    const template = document.createElement('template');
    template.innerHTML = input;
    if (template.content == null || template.content.firstElementChild == null)
    {
        throw new Error('Invalid html template to render');
    }

    return template.content.firstElementChild as HTMLElement;
}
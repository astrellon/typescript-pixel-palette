export class Reducer<TState>
{
    actionTypes: string[] = [];

    execute(state: TState, action: any)
    {
        return state;
    }
}

export type Selector<TState> = (state: TState) => any;
export class SelectorContext<TState>
{
    func: Selector<TState>;
    prevValue: any;

    constructor(func: Selector<TState>, startValue: any = undefined)
    {
        this.func = func;
        this.prevValue = startValue;
    }

    getValue(state: TState): any
    {
        return this.func(state);
    }

    checkIfChanged(newValue: any): boolean
    {
        const result = newValue !== this.prevValue;
        this.prevValue = newValue;
        return result;
    }
}

export type Callback<TState> = (state: TState, newValue: any) => void;
export type RemoveCallback = () => void;
export type RemoveReducer = () => void;
export interface Action
{
    type: string
}

export class Store<TState>
{
    currentState: TState;
    reducers: Reducer<TState>[] = [];
    callbacks: {selector: SelectorContext<TState>, callback: Callback<TState>}[]  = [];

    constructor(initialState: TState)
    {
        this.currentState = initialState;
    }

    addReducer(reducer: Reducer<TState>): RemoveReducer
    {
        this.reducers.push(reducer);

        let removed = false;
        return function()
        {
            if (removed)
            {
                return;
            }

            const index = this.reducers.indexOf(reducer);
            if (index >= 0)
            {
                this.reducers.splice(index, 1);
            }
            removed = true;
        }
    }

    dispatch(action: Action)
    {
        let state = this.currentState;
        for (let reducer of this.reducers)
        {
            if (reducer.actionTypes.indexOf(action.type) >= 0)
            {
                state = reducer.execute(state, action);
            }
        }
        this.currentState = state;

        for (let callback of this.callbacks)
        {
            const newValue = callback.selector.getValue(state);
            if (callback.selector.checkIfChanged(newValue))
            {
                callback.callback(state, newValue);
            }
        }
    }

    subscribe(selector: Selector<TState>, callback: Callback<TState>): RemoveCallback
    {
        const startValue = selector(this.currentState);
        const obj = {selector: new SelectorContext(selector, startValue), callback};
        this.callbacks.push(obj);

        let removed = false;
        return function()
        {
            if (removed)
            {
                return;
            }

            const index = this.callback.indexOf(obj);
            if (index >= 0)
            {
                this.callback.splice(index, 1);
            }
            removed = true;
        }
    }

    subscribeAny(callback: Callback<TState>): RemoveCallback
    {
        return this.subscribe((state) => { return state; }, callback);
    }
}

import NodeWrapper from "./NodeWrapper";

export default class UndoRedoManager {
    // The stack we push actions onto and pop off.
    private static _stack: Array<Action> = [];

    // Our current location within the action stack.
    // This will usually be equal to _stack.length - 1,
    // indicating that we are at the top of the stack.
    // However, if we start undoing actions, we will move
    // down the stack. 
    private static _stackLocation: number = -1;

    public static pushAction(action: Action, performForward: boolean = true) {
        if (this._stackLocation == this._stack.length - 1) {
            // We are at the top of the stack, so we can
            // just add this new action to the top.
            this._stack.push(action);
            this._stackLocation += 1;
        } else {
            // We are not at the top of the stack, so we
            // need to remove all of the actions from the
            // top down to the current one.
            while (this._stack.length > 0 && this._stackLocation < this._stack.length - 1) {
                this._stack.pop();
            }
            this._stack.push(action);
            this._stackLocation = this._stack.length - 1;
        }

        if (performForward) {
            action.forward();
        }
    }

    public static redo() {
        if (this._stackLocation == this._stack.length - 1) {
            console.error("Can't redo because we're at the top of the stack");
            return;
        }
        this._stackLocation += 1;
        this._stack[this._stackLocation].forward();
    }

    public static undo() {
        if (this._stackLocation == -1) {
            console.error("Can't undo because the stack is empty");
            return;
        }
        this._stack[this._stackLocation].backward();
        this._stackLocation -= 1;
    }
}

export class Action {
    public name: string;
    public displayString: string;
    private _forward: (data: ActionData) => void;
    private _backward: (data: ActionData) => void;
    private _data: ActionData;

    constructor(name: string, displayString: string, forward: (data: ActionData) => void, backward: (data: ActionData) => void, data: ActionData) {
        this.name = name;
        this.displayString = displayString;
        this._forward = forward;
        this._backward = backward;
        this._data = data;
    }

    public forward() {
        this._forward(this._data);
        console.log(`FORWARD: ${this.displayString}`);
    }

    public backward() {
        this._backward(this._data);
        console.log(`BACKWARD: ${this.displayString}`);
    }
}

export class ActionData {}

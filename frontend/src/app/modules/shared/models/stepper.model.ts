export class Stepper<T = any> {
    currentStepIndex: number;
    steps: Step<T>[];

    onStepChange: (step: Step<T>, index: number) => void;

    private _data: T;
    get data(): T {
        return this._data;
    }

    set data(value: T) {
        this._data = value;
    }

    constructor(steps: Step<T>[]) {
        this.steps = steps;
        this.toStep(1);
    }

    hasNext() {
        return this.currentStepIndex < this.steps.length && this.steps[this.currentStepIndex].enabled;
    }

    next() {
        if (this.hasNext()) {
            this.toStep(this.currentStepIndex + 1);
        }
    }

    hasPrevious() {
        return this.currentStepIndex - 1 > 0 && this.steps[this.currentStepIndex - 2].enabled;
    }

    previous() {
        if (this.hasPrevious()) {
            this.toStep(this.currentStepIndex - 1);
        }
    }

    isStep(index: number): boolean {
        return this.currentStepIndex === index;
    }

    currentStep(): Step<T> {
        return this.steps[this.currentStepIndex - 1];
    }

    toStep(index: number) {
        this.currentStepIndex = index;
        if (this.onStepChange) {
            this.onStepChange(this.currentStep(), this.currentStepIndex);
        }
    }

    shouldShowControls() {
        try {
            return this.currentStep().showControlsFunction(this.data);
        } catch (e) {
            return true;
        }
    }
}

interface IStepConstructor<T> {
    title: string;
    description?: string;
    enabled?: boolean;
    validatorFunction?: (data: T) => boolean;
    showControlsFunction?: (data: T) => boolean;
}

export class Step<T> {
    title: string;
    description: string;
    status: 'wait' | 'process' | 'finish' | 'error' = 'wait';
    enabled: boolean;
    validatorFunction: (data: T) => boolean;
    showControlsFunction: (data: T) => boolean;

    constructor({
        title,
        description,
        enabled = true,
        validatorFunction = () => true,
        showControlsFunction = () => true,
    }: IStepConstructor<T>) {
        this.title = title;
        this.description = description;
        this.enabled = enabled;
        this.validatorFunction = validatorFunction;
        this.showControlsFunction = showControlsFunction;
    }
}

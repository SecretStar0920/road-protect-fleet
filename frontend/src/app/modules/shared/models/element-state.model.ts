export interface IStandardError {
    message: string;
    statusCode: string;
    error?: {
        message: string;
        statusCode: number;
    };
}

export class ElementStateModel<Success = any, Failure = IStandardError> {
    private loading: boolean = false;
    private loaded: boolean = false;
    private success: boolean = false;
    private message: string = '';
    private successContext: Success;
    private errorContext: Failure;

    constructor(startSubmitting?: boolean) {
        this.reset();
        if (startSubmitting) {
            this.submit();
        }
    }

    public submit(): void {
        this.loading = true;
        this.loaded = false;
        this.success = false;
    }

    public onSuccess(message?: string, context?: Success): void {
        this.complete(true);
        if (message) {
            this.message = message;
        }
        if (context) {
            this.successContext = context;
        }
    }

    public onFailure(message?: string, context?: Failure): void {
        this.complete(false);
        if (message) {
            this.message = message;
        }
        if (context) {
            this.errorContext = context;
        }
    }

    private complete(success: boolean): void {
        this.loaded = true;
        this.loading = false;
        this.success = success;
    }

    public hasFailed(): boolean {
        return this.loaded && !this.success;
    }

    public hasSucceeded(): boolean {
        return this.loaded && this.success;
    }

    public hasCompleted(): boolean {
        return this.loaded;
    }

    public isLoading(): boolean {
        return this.loading;
    }

    public reset(): void {
        this.loading = false;
        this.loaded = false;
        this.success = false;
        this.message = '';
        this.successContext = null;
        this.errorContext = null;
    }

    public successResult(): { message: string; context: Success } {
        return {
            message: this.message,
            context: this.successContext,
        };
    }

    public failedResult(): { message: string; context: Failure } {
        return {
            message: this.message,
            context: this.errorContext,
        };
    }

    public getSpecificErrorMessage(): string {
        const failedResult = this.failedResult();
        const context = (failedResult.context as unknown) as IStandardError;
        return context?.error?.message || failedResult.message;
    }
}

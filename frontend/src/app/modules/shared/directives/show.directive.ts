import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[rpShow]',
})
export class ShowDirective {
    private readonly initialDisplay: string;

    private _show: boolean = false;
    get show(): boolean {
        return this._show;
    }

    @Input('rpShow')
    set show(value: boolean) {
        this._show = value;
        if (value === false) {
            this.el.nativeElement.style.display = 'none';
        } else {
            this.el.nativeElement.style.display = this.initialDisplay;
        }
    }

    constructor(private el: ElementRef) {
        this.initialDisplay = this.el.nativeElement.style.display;
    }
}

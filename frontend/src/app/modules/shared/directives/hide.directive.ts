import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[rpHide]',
})
export class HideDirective {
    private readonly initialDisplay: string;

    private _hide: boolean = false;
    get hide(): boolean {
        return this._hide;
    }

    @Input('rpHide')
    set hide(value: boolean) {
        this._hide = value;
        if (value === true) {
            this.el.nativeElement.style.display = 'none';
        } else {
            this.el.nativeElement.style.display = this.initialDisplay;
        }
    }

    constructor(private el: ElementRef) {
        this.initialDisplay = this.el.nativeElement.style.display;
    }
}

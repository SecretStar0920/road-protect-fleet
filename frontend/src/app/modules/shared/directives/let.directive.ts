import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface LetContext<T> {
    rpLet: T;
}

@Directive({
    selector: '[rpLet]',
})
export class LetDirective<T> {
    private _context: LetContext<T> = { rpLet: null };

    constructor(_viewContainer: ViewContainerRef, _templateRef: TemplateRef<LetContext<T>>) {
        _viewContainer.createEmbeddedView(_templateRef, this._context);
    }

    @Input()
    set rpLet(value: T) {
        this._context.rpLet = value;
    }
}

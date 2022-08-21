import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'rp-general-boolean-display',
    templateUrl: './general-boolean-display.component.html',
    styleUrls: ['./general-boolean-display.component.less'],
})
export class GeneralBooleanDisplayComponent implements OnInit {
    @Input()
    status: boolean;

    @Input()
    successText = 'Valid';

    @Input()
    errorText = 'Invalid';

    constructor() {}

    ngOnInit(): void {}
}

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'rp-general-form-error-display',
    templateUrl: './general-form-error-display.component.html',
    styleUrls: ['./general-form-error-display.component.less'],
})
export class GeneralFormErrorDisplayComponent implements OnInit {
    @Input() form: FormGroup;
    @Input() key: string;

    @Input() control: FormControl;

    constructor() {}

    ngOnInit() {}
}

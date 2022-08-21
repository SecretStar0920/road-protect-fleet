import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'rp-general-form-errors-display',
    templateUrl: './general-form-errors-display.component.html',
    styleUrls: ['./general-form-errors-display.component.less'],
})
export class GeneralFormErrorsDisplayComponent implements OnInit {
    @Input() form: FormGroup;

    constructor() {}

    ngOnInit() {}

    isFormGroup(control) {
        return control instanceof FormGroup;
    }
}

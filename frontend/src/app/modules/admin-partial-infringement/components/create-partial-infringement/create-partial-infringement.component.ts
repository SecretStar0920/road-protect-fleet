import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import i18next from 'i18next';
import { PartialInfringement } from '@modules/shared/models/entities/partial-infringement.model';
import { PartialInfringementService } from '@modules/admin-partial-infringement/services/partial-infringement.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'rp-create-partial-infringement',
    templateUrl: './create-partial-infringement.component.html',
    styleUrls: ['./create-partial-infringement.component.less'],
})
export class CreatePartialInfringementComponent implements OnInit, OnDestroy {
    destroy$ = new Subject();
    createPartialInfringementForm: FormGroup;
    createPartialInfringementState: ElementStateModel<PartialInfringement> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    get f() {
        return this.createPartialInfringementForm.controls;
    }

    constructor(private partialInfringementService: PartialInfringementService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.createPartialInfringementForm = this.fb.group({
            details: new FormControl(null, [Validators.required, this.jsonValidator.bind(this)]),
        });
    }

    jsonValidator(control: FormControl): { [s: string]: boolean } {
        try {
            JSON.parse(control.value);
        } catch (e) {
            return { jsonInvalid: true };
        }
        return null;
    }

    onCreatePartialInfringement() {
        this.createPartialInfringementState.submit();
        this.partialInfringementService
            .createPartialInfringement(this.createPartialInfringementForm.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.logger.info('Successfully created a Partial Infringement', result);
                    this.createPartialInfringementState.onSuccess(i18next.t('create-partial-infringement.success'), result);
                    this.complete.emit(this.createPartialInfringementState);
                },
                (error) => {
                    this.logger.error('Failed to create a Partial Infringement', error);
                    this.createPartialInfringementState.onFailure(i18next.t('create-partial-infringement.fail'), error.error);
                    this.complete.emit(this.createPartialInfringementState);
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}

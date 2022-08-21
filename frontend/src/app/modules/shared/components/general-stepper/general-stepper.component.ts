import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-general-stepper',
    templateUrl: './general-stepper.component.html',
    styleUrls: ['./general-stepper.component.less'],
})
export class GeneralStepperComponent implements OnInit {
    @Input() stepper: Stepper;
    @Input() size: 'default' | 'small' = 'small';
    @Input() dot = false;
    @Input() showControls: boolean = true;

    @Output() next = new EventEmitter<number>();
    @Output() previous = new EventEmitter<number>();
    constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        // this.stepper.onStepChange = this.changeParamStep;
    }
    changeParamStep = (step: Step<any>, index: number) => {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { stage: step.title, step: index },
            queryParamsHandling: 'merge',
        });
    };
}

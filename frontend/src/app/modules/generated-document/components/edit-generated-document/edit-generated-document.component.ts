import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneratedDocument } from '@modules/shared/models/entities/generated-document.model';
import { forEach, isNil } from 'lodash';
import { GeneratedDocumentService } from '@modules/generated-document/services/generated-document.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { DocumentTemplateField, DocumentTemplateFieldTypes } from '@modules/shared/models/entities/document-template.model';
import { plainToClass } from 'class-transformer';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import { DocumentLinkableTargets, DocumentService } from '@modules/document/services/document.service';
import { Observable, Subject, timer } from 'rxjs';
import i18next from 'i18next';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-edit-generated-document',
    templateUrl: './edit-generated-document.component.html',
    styleUrls: ['./edit-generated-document.component.less'],
})
export class EditGeneratedDocumentComponent implements OnInit, OnDestroy {
    destroy$ = new Subject();

    @Input() target: DocumentLinkableTargets;
    @Input() targetId: string;

    generateState: ElementStateModel = new ElementStateModel<any>();
    confirmState: ElementStateModel = new ElementStateModel<any>();
    updateState: ElementStateModel = new ElementStateModel<any>();

    fieldTypes = DocumentTemplateFieldTypes;

    stepper: Stepper<any> = new Stepper<any>([
        new Step({
            title: i18next.t('edit-generated-document.verify_information'),
            validatorFunction: (data) => data.generateState.hasSucceeded(),
        }),
        new Step({
            title: i18next.t('edit-generated-document.check_document'),
            validatorFunction: (data) => data.confirmState.hasSucceeded(),
        }),
        // new Step({ title: i18next.t('edit-generated-document.complete'), validatorFunction: data => true }),
    ]);

    private _generatedDocument: GeneratedDocument;
    get generatedDocument(): GeneratedDocument {
        return this._generatedDocument;
    }
    @Input()
    set generatedDocument(value: GeneratedDocument) {
        this._generatedDocument = plainToClass(GeneratedDocument, value);
        if (value) {
            this.initialiseForm();
        }
    }
    form: FormGroup = new FormGroup({});

    returnTo: string;
    returnTimer: Observable<any>;

    getField(field: string): DocumentTemplateField {
        return this.generatedDocument.form.fields[field] || null;
    }

    constructor(
        private fb: FormBuilder,
        private generatedDocumentService: GeneratedDocumentService,
        private documentService: DocumentService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.stepper.data = {
            generateState: this.generateState,
            confirmState: this.confirmState,
            updateState: this.generateState,
        };

        this.activatedRoute.queryParams.subscribe((params) => {
            this.returnTo = params.returnTo;
        });
    }

    initialiseForm() {
        this.form = new FormGroup({});

        forEach(this._generatedDocument.form.fields, (val, key) => {
            this.form.addControl(key, new FormControl(val.value, val.required ? Validators.required : []));
        });

        this.form.valueChanges.pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((result) => {
            // Update document
            forEach(result, (val, key) => {
                const control = this._generatedDocument.form.fields[key];
                if (!isNil(control)) {
                    this._generatedDocument.form.fields[key].value = val;
                }
            });

            this.onUpdate();
        });
    }

    onUpdate() {
        this.updateState.submit();
        this.generatedDocumentService
            .updateGeneratedDocument(this.generatedDocument.generatedDocumentId, { form: this.generatedDocument.form })
            .subscribe(
                (result) => {
                    this.updateState.onSuccess('Updated document');
                    // this._generatedDocument = plainToClass(GeneratedDocument, result);
                    // // Update form to sync
                    // forEach(this._generatedDocument.form.fields, (val, key) => {
                    //     this.form.controls[key].setValue(val.value);
                    // });
                },
                (error) => {
                    this.updateState.onFailure('Failed to update document', error);
                },
            );
    }

    onGenerate() {
        this.generateState.submit();
        this.generatedDocumentService.generatedGeneratedDocument(this.generatedDocument.generatedDocumentId).subscribe(
            (result) => {
                this.stepper.next();
                this.generateState.onSuccess();
                this.generatedDocument = result;
            },
            (error) => {
                this.generateState.onFailure('Failed to generate document', error);
            },
        );
    }

    onConfirm() {
        this.confirmState.submit();
        this.generatedDocumentService
            .confirmGeneratedDocument(this.generatedDocument.generatedDocumentId, {
                documentId: this.generatedDocument.document.documentId,
                target: this.target,
                targetId: this.targetId,
            })
            .subscribe(
                (result) => {
                    this.confirmState.onSuccess();
                    this.generatedDocument = result;
                    this.stepper.next();

                    if (this.returnTo) {
                        this.returnTimer = timer(0, 1000);
                        this.returnTimer.subscribe((time) => {
                            if (time === 3) {
                                this.takeBack();
                            }
                        });
                    }
                },
                (error) => {
                    this.confirmState.onFailure('Failed to confirm document', error);
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    takeBack() {
        this.router.navigateByUrl(this.returnTo);
    }

    getUploadLink() {
        return `${window.location.origin}/home/documents/upload/${this.target}/${this.targetId}`;
    }

    onUploadLinkClick() {
        window.open(this.getUploadLink());
    }
}

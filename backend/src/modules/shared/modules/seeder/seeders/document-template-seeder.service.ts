import { Injectable } from '@nestjs/common';
import { BaseSeederService } from '@seeder/seeders/base-seeder.service';
import { CreateDocumentTemplateService } from '@modules/document-template/services/create-document-template.service';
import { CreateDocumentTemplateDto } from '@modules/document-template/controllers/document-template.controller';
import { Config } from '@config/config';
import { DocumentTemplateForm } from '@modules/shared/entities/entities';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DocumentTemplateSeederService extends BaseSeederService<CreateDocumentTemplateDto> {
    protected seederName: string = 'Document';

    constructor(private createDocumentTemplateService: CreateDocumentTemplateService) {
        super();
    }

    async setSeedData() {
        this.seedData = [
            {
                name: 'Power of Attorney',
                url: `${Config.get.siblings['document-renderer'].url}/power-of-attorney/:id`,
                lang: 'en',
                form: new DocumentTemplateForm({
                    fieldOrder: ['name', 'identifier', 'lawyerId', 'lawyerName', 'representativeName', 'signatureOne', 'signatureTwo'],
                    fields: {
                        name: {
                            type: 'Text',
                            label: 'Account Name',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'name',
                                fromBaseEntity: 'account',
                            },
                            required: true,
                        },
                        lawyerId: {
                            type: 'Text',
                            label: 'Lawyer ID',
                            value: '',
                            autofill: {
                                enabled: false,
                            },
                            required: false,
                        },
                        identifier: {
                            type: 'Text',
                            label: 'Account Identifier / BRN',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'identifier',
                                fromBaseEntity: 'account',
                            },
                            required: true,
                        },
                        lawyerName: {
                            type: 'Text',
                            label: 'Lawyer Name',
                            value: '',
                            autofill: {
                                enabled: false,
                            },
                            required: false,
                        },
                        signatureOne: {
                            type: 'Signature',
                            label: 'Your signature',
                            value: '',
                            autofill: {
                                enabled: false,
                                withPath: 'identifier',
                                fromBaseEntity: 'account',
                            },
                            required: false,
                        },
                        signatureTwo: {
                            type: 'Signature',
                            label: 'Attorney Signature',
                            value: '',
                            autofill: {
                                enabled: false,
                                withPath: 'identifier',
                                fromBaseEntity: 'account',
                            },
                            required: false,
                        },
                        representativeName: {
                            type: 'Text',
                            label: 'Account Representative Name',
                            value: '',
                            autofill: {
                                enabled: false,
                            },
                            required: true,
                        },
                    },
                    language: 'he',
                }),
            },
            {
                name: 'LeaseSubstitute',
                url: `${Config.get.siblings['document-renderer'].url}/redirection/:id`,
                lang: 'en',
                form: new DocumentTemplateForm({
                    fieldOrder: [
                        'userName',
                        'userLocation',
                        'userIdentification',
                        'userSignature',
                        'userStamp',
                        'ownerName',
                        'ownerNamePosition',
                        'ownerIdentification',
                        'vehicleRegistration',
                        'leaseStartDate',
                        'leaseEndDate',
                    ],
                    fields: {
                        userName: {
                            type: 'Text',
                            label: 'What is the account name of the User?',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'user.name',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        ownerName: {
                            type: 'Text',
                            label: 'What is the account name of the Owner?',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'owner.name',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        userStamp: {
                            type: 'Image',
                            label: 'User Account Stamp',
                            value: '',
                            autofill: {
                                enabled: false,
                            },
                            required: false,
                        },
                        leaseEndDate: {
                            type: 'Text',
                            label: 'What is the end date of the lease?',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'endDate',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        userLocation: {
                            type: 'Text',
                            label: 'What is the address of the User?',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'user.physicalLocation.address',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        leaseStartDate: {
                            type: 'Text',
                            label: 'What is the start date of the lease?',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'startDate',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        userSignature: {
                            type: 'Signature',
                            label: 'User Representative Signature',
                            value: '',
                            autofill: {
                                enabled: false,
                            },
                            required: false,
                        },
                        ownerNamePosition: {
                            type: 'Text',
                            label: 'What is the name and position of the Owner Account Representative',
                            value: '',
                            autofill: {
                                enabled: false,
                            },
                            required: true,
                        },
                        userIdentification: {
                            type: 'Text',
                            label: 'What is the BRN / Identification of the User?',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'user.identifier',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        ownerIdentification: {
                            type: 'Text',
                            label: 'What is the BRN / Identification of the Owner?',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'owner.identifier',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        vehicleRegistration: {
                            type: 'Text',
                            label: `What is the vehicle's registration?`,
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'vehicle.registration',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                    },
                    language: 'he',
                }),
            },
            {
                name: 'RedirectionV2',
                url: `${Config.get.siblings['document-renderer'].url}/redirection-v2/:id`,
                lang: 'en',
                form: new DocumentTemplateForm({
                    fieldOrder: [
                        'ownerFleetManagerLogo',
                        'municipalityName',
                        'infringementNoticeNumber',
                        'ownerFleetManagerName',
                        'ownerFleetManagerId',
                        'ownerCompanyName',
                        'ownerBrn',
                        'vehicleRegistration',
                        'targetName',
                        'targetIdentifier',
                        'targetAddress',
                        'leaseStartDate',
                        'leaseEndDate',
                        'infringementOffenceDate',
                        'ownerFleetManagerSignature',
                        'ownerFleetManagerVehicleOfficerSignature',
                    ],
                    fields: {
                        ownerFleetManagerLogo: {
                            type: 'Image',
                            label: 'Fleet Managers Logo',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'owner.fleetManagerDetails.logo',
                                fromBaseEntity: 'contract',
                            },
                            required: false,
                        },
                        municipalityName: {
                            type: 'Text',
                            label: 'Municipality Name',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'issuer.name',
                                fromBaseEntity: 'infringement',
                            },
                            required: true,
                        },
                        infringementNoticeNumber: {
                            type: 'Text',
                            label: 'Infringement Notice Number',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'noticeNumber',
                                fromBaseEntity: 'infringement',
                            },
                            required: true,
                        },
                        ownerFleetManagerName: {
                            type: 'Text',
                            label: 'Fleet Manager Name',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'owner.fleetManagerDetails.name',
                                fromBaseEntity: 'contract',
                            },
                            required: false,
                        },
                        ownerFleetManagerId: {
                            type: 'Text',
                            label: 'Fleet Manager Identification',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'owner.fleetManagerDetails.id',
                                fromBaseEntity: 'contract',
                            },
                            required: false,
                        },
                        ownerCompanyName: {
                            type: 'Text',
                            label: 'Owner Company Name',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'owner.name',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        ownerBrn: {
                            type: 'Text',
                            label: 'Owner BRN',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'owner.identifier',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        vehicleRegistration: {
                            type: 'Text',
                            label: 'Vehicle Registration',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'vehicle.registration',
                                fromBaseEntity: 'infringement',
                            },
                            required: true,
                        },
                        targetName: {
                            type: 'Text',
                            label: 'User Name',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'user.name',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        targetIdentifier: {
                            type: 'Text',
                            label: 'User BRN',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'user.identifier',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        targetAddress: {
                            type: 'Text',
                            label: 'User Address',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'redirectionTargetAddress',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        leaseStartDate: {
                            type: 'Text',
                            label: 'Lease Start Date',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'startDate',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        leaseEndDate: {
                            type: 'Text',
                            label: 'Lease End Date',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'endDate',
                                fromBaseEntity: 'contract',
                            },
                            required: true,
                        },
                        infringementOffenceDate: {
                            type: 'Text',
                            label: 'Infringement Offence Date',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'offenceDate',
                                fromBaseEntity: 'infringement',
                            },
                            required: true,
                        },
                        ownerFleetManagerSignature: {
                            type: 'Signature',
                            label: 'Fleet Manager Signature (Fill in by printing and signing)',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'owner.fleetManagerDetails.signatureSvg',
                                fromBaseEntity: 'contract',
                            },
                            required: false,
                        },
                        ownerFleetManagerVehicleOfficerSignature: {
                            type: 'Image',
                            label: 'Scanned image with the vehicle officers statement, details and signature',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'owner.fleetManagerDetails.vehicleOfficerSignature',
                                fromBaseEntity: 'contract',
                            },
                            required: false,
                        },
                    },
                    language: 'he',
                }),
            },
            {
                name: 'Infringement',
                url: `${Config.get.siblings['document-renderer'].url}/infringement/:id`,
                lang: 'en',
                form: new DocumentTemplateForm({
                    fieldOrder: ['noticeNumber', 'vehicle', 'offenceDate'],
                    fields: {
                        vehicle: {
                            type: 'Text',
                            label: 'Vehicle Registration',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'vehicle.registration',
                                fromBaseEntity: 'infringement',
                            },
                            required: true,
                        },
                        offenceDate: {
                            type: 'Text',
                            label: 'Offence Date',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'offenceDate',
                                fromBaseEntity: 'infringement',
                            },
                            required: true,
                        },
                        noticeNumber: {
                            type: 'Text',
                            label: 'Notice Number',
                            value: '',
                            autofill: {
                                enabled: true,
                                withPath: 'noticeNumber',
                                fromBaseEntity: 'infringement',
                            },
                            required: true,
                        },
                    },
                    language: 'he',
                }),
            },
        ];

        if (this.isDevelopment) {
            this.seedData = [...this.seedData, ...[]];
        }
    }

    async seedItemFunction(item) {
        item = plainToClass(CreateDocumentTemplateDto, item);

        return this.createDocumentTemplateService.createDocumentTemplate(item);
    }
}

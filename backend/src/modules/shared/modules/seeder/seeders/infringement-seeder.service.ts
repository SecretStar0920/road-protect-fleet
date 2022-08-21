import { Injectable } from '@nestjs/common';
import { BaseSeederService } from '@seeder/seeders/base-seeder.service';
import { Account, Issuer, Vehicle } from '@entities';
import * as moment from 'moment';
import { CreateInfringementService } from '@modules/infringement/services/create-infringement.service';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { plainToClass } from 'class-transformer';
import * as faker from 'faker';
import { IssuerStatusMap } from '@modules/infringement/helpers/status-mapper/config/issuer-status-map';
import { UpsertInfringementNoteService } from '@modules/infringement-note/services/upsert-infringement-note-service';

@Injectable()
export class InfringementSeederService extends BaseSeederService<CreateInfringementDto> {
    protected seederName: string = 'Infringement';

    constructor(
        private createInfringementService: CreateInfringementService,
        private upsertInfringementNoteService: UpsertInfringementNoteService,
    ) {
        super();
    }

    async setSeedData() {
        this.seedData = [];

        if (this.isDevelopment) {
            this.seedData = [
                ...this.seedData,
                ...[
                    {
                        noticeNumber: '111111111',
                        vehicle: 'TESTVEHICLEONE',
                        issuer: (await Issuer.findOne(1)).name,
                        amountDue: '500',
                        originalAmount: '400',
                        offenceDate: moment().toISOString(),
                        streetName: 'Street Name One',
                        streetNumber: '54',
                        city: 'City One',
                        country: 'Israel',
                        brn: 'OWNER_IDENTIFIER',
                    },
                    {
                        noticeNumber: '222222222',
                        vehicle: 'TESTVEHICLEONE',
                        issuer: (await Issuer.findOne(2)).name,
                        amountDue: '500',
                        originalAmount: '400',
                        offenceDate: moment().toISOString(),
                        city: 'City One',
                        streetName: 'Street Name One',
                        streetNumber: '54',
                        country: 'Israel',
                    },
                    {
                        noticeNumber: '333333333',
                        vehicle: 'TESTVEHICLEONE',
                        issuer: (await Issuer.findOne(3)).name,
                        amountDue: '500',
                        originalAmount: '400',
                        offenceDate: moment().toISOString(),
                        city: 'City One',
                        streetName: 'Street Name One',
                        streetNumber: '54',
                        country: 'Israel',
                    },
                ],
                ...(await this.createRandomInfringementSeedData()),
            ];
        }
    }

    private async createRandomInfringementSeedData(amount: number = 100): Promise<CreateInfringementDto[]> {
        const issuers = await Issuer.find();
        const vehicles = await Vehicle.find();
        const accounts = await Account.find();
        const dtos: CreateInfringementDto[] = [];
        let issuerStatus = null;
        if (Math.random() > 0.5) {
            issuerStatus = this.pickRandomFromArray(Object.keys(IssuerStatusMap.get));
        }
        for (let i = 0; i < amount; i++) {
            const dto: CreateInfringementDto = {
                noticeNumber: `${faker.random.number({ min: 100000000, max: 1000000000 })}`,
                vehicle: this.pickRandomFromArray<Vehicle>(vehicles).registration,
                issuer: this.pickRandomFromArray<Issuer>(issuers).code,
                amountDue: `${faker.random.number(1000)}`,
                originalAmount: `${faker.random.number(1000)}`,
                offenceDate: moment().toISOString(),
                issuerStatus: Math.random() > 0.5 ? this.pickRandomFromArray(Object.keys(IssuerStatusMap.get)) : null,
                streetName: faker.address.streetName(),
                streetNumber: `${faker.random.number(400)}`,
                country: 'Israel',
                city: faker.address.city(),
                brn: Math.random() > 0.5 ? this.pickRandomFromArray(accounts).identifier : null,
                isExternal: true,
            };
            dtos.push(dto);
        }
        return dtos;
    }

    pickRandomFromArray<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    async seedItemFunction(item: CreateInfringementDto) {
        item = plainToClass(CreateInfringementDto, item);
        const infringement = await this.createInfringementService.createInfringement(item);
        // Upsert infringement notes - infringement needs to be created and saved before linking a note
        if (item.note) {
            await this.upsertInfringementNoteService.upsertInfringementNote({ value: item.note }, null, infringement);
        }
        return infringement;
    }
}

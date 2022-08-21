import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Infringement } from '@entities';
import { Brackets } from 'typeorm';

@Injectable()
export class GetInfringementsService {
    constructor(private logger: Logger) {}

    async get(): Promise<Infringement[]> {
        this.logger.log({ message: `Getting Infringements`, detail: null, fn: this.get.name });
        const infringements = await Infringement.findWithMinimalRelations().getMany();
        this.logger.log({ message: `Found Infringements, length: `, detail: infringements.length, fn: this.get.name });
        return infringements;
    }

    async getInfringementsForIssuer(issuerId: number): Promise<Infringement[]> {
        this.logger.log({ message: `Getting Infringements for Issuer`, detail: null, fn: this.get.name });
        const infringements = await Infringement.findWithMinimalRelations().andWhere('issuer.issuerId = :issuerId', { issuerId }).getMany();
        this.logger.log({ message: `Found Infringements for Issuer, length: `, detail: infringements.length, fn: this.get.name });
        return infringements;
    }

    async getInfringementsForVehicle(vehicleId: number): Promise<Infringement[]> {
        this.logger.log({ message: `Getting Infringements for Vehicle`, detail: null, fn: this.get.name });
        const infringements = await Infringement.findWithMinimalRelations()
            .andWhere('vehicle.vehicleId = :vehicleId', { vehicleId })
            .getMany();
        this.logger.log({ message: `Found Infringements for Vehicle, length: `, detail: infringements.length, fn: this.get.name });
        return infringements;
    }

    async getInfringementsForAccount(accountId: number): Promise<Infringement[]> {
        this.logger.log({ message: `Getting Infringements for account`, detail: null, fn: this.get.name });
        const infringements = await Infringement.findWithMinimalRelationsAndAccounts()
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('user.accountId = :id', { id: accountId });
                    qb.orWhere('owner.accountId = :id', { id: accountId });
                }),
            )
            .getMany();
        this.logger.log({ message: `Found Infringements for account, length: `, detail: infringements.length, fn: this.get.name });
        return infringements;
    }
}

import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Document } from '@entities';

@Injectable()
export class GetDocumentsService {
    constructor(private logger: Logger) {}

    async getDocuments(): Promise<Document[]> {
        this.logger.log({ message: `Getting Documents`, detail: null, fn: this.getDocuments.name });
        const documents = await Document.find();
        this.logger.log({ message: `Found Documents, length: `, detail: documents.length, fn: this.getDocuments.name });
        return documents;
    }

    async getDocumentsForVehicle(vehicleId: number): Promise<Document[]> {
        this.logger.log({ message: `Getting Documents`, detail: null, fn: this.getDocuments.name });
        const documents = await Document.createQueryBuilder('document')
            .leftJoinAndSelect('document.vehicleDocuments', 'vehicleDocument')
            .leftJoinAndSelect('document.contracts', 'vehicleDocument')
            .leftJoin('vehicleDocument.vehicle', 'vehicle')
            .addSelect(['vehicle.vehicleId', 'vehicle.registration'])
            .andWhere('vehicle.vehicleId = :vehicleId', { vehicleId })
            .getMany();
        this.logger.log({ message: `Found Documents, length: `, detail: documents.length, fn: this.getDocuments.name });
        return documents;
    }
}

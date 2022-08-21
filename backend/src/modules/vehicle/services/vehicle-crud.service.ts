import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Vehicle } from '@entities';

@Injectable()
export class VehicleCrudService extends TypeOrmCrudService<Vehicle> {
    constructor(@InjectRepository(Vehicle) repo) {
        super(repo);
    }
}

// @ts-ignore
VehicleCrudService.prototype.getJoinType = function getJoinType(relationType: string) {
    return 'leftJoin';
};

import { RawInfringement } from '@entities';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';

export abstract class RawInfringementMapper {
    abstract async isExistingInfringement(raw: RawInfringement): Promise<{ infringementId: number; exists: boolean }>;
    abstract async getCreateInfringementDto(raw: RawInfringement): Promise<CreateInfringementDto>;
    abstract async getUpdateInfringementDto(
        raw: RawInfringement,
    ): Promise<{ dto: UpdateInfringementDto; perform: boolean; additional?: any }>;

    abstract async getNominationDtoFromRawInfringement(raw: RawInfringement): Promise<NominationDto>;
}

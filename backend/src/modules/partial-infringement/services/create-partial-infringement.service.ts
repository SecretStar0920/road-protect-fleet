import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { PartialInfringement } from '@entities';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CreatePartialInfringementDto } from '@modules/partial-infringement/dtos/create-partial-infringement.dto';
import { PartialInfringementDetailsDto } from '@modules/partial-infringement/dtos/partial-infringement-details.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class CreatePartialInfringementService {
    constructor(private logger: Logger) {}

    @Transactional()
    async createPartialInfringement(dto: CreatePartialInfringementDto): Promise<PartialInfringement> {
        this.logger.debug({ message: 'Creating Partial Infringement', detail: dto, fn: this.createPartialInfringement.name });
        let partialInfringement;

        if (typeof dto.details === 'string') {
            try {
                dto.details = JSON.parse(dto.details);
            } catch (e) {
                this.logger.warn({
                    message: 'Could not convert string details object too a JSON object',
                    fn: this.createPartialInfringement.name,
                    detail: e,
                });
            }
        }

        if (dto.details.noticeNumber && !dto.noticeNumber) {
            dto.noticeNumber = dto.details.noticeNumber;
        }

        try {
            partialInfringement = await PartialInfringement.create(dto).save();
        } catch (e) {
            this.logger.error({
                message: 'Failed to create partial infringement on create',
                detail: { error: e, dto },
                fn: this.createPartialInfringement.name,
            });
            throw new BadRequestException({ message: ERROR_CODES.E092_FailedToCreatePartialInfringement.message(), e });
        }
        this.logger.debug({
            message: 'Created Partial Infringement',
            detail: partialInfringement,
            fn: this.createPartialInfringement.name,
        });
        return partialInfringement;
    }

    @Transactional()
    async createPartialInfringementFromSpreadSheet(dto: PartialInfringementDetailsDto): Promise<PartialInfringement> {
        this.logger.debug({ message: 'Creating Partial Infringement', detail: dto, fn: this.createPartialInfringement.name });

        const createDto: CreatePartialInfringementDto = {
            details: dto,
            noticeNumber: dto.noticeNumber,
        };
        return this.createPartialInfringement(createDto);
    }
}

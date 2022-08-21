import { IsArray } from 'class-validator';

export class RedirectMissingInfringementsDto {
    @IsArray()
    infringementIds: number[];
}

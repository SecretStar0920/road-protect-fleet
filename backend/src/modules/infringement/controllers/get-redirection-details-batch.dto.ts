import { IsInt } from 'class-validator';

export class GetRedirectionDetailsBatchDto {
    @IsInt({ each: true })
    infringementIds: number[];
}

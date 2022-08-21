import { IsArray, IsIn, IsOptional } from 'class-validator';

export class DeleteAccountLeaseContractsDto {
    @IsOptional()
    @IsArray()
    excludeIds: number[];
}

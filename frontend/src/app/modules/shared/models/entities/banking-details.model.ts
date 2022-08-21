import { IsOptional, IsString } from 'class-validator';

export class BankingDetails {
    @IsString()
    bankName: string;
    @IsString()
    @IsOptional()
    branchName: string;
    @IsString()
    branchCode: string;
    @IsString()
    accountHolder: string;
    @IsString()
    accountNumber: string;
    @IsString()
    accountType: string;
}

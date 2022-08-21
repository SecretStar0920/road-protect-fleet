import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';
import { Expose } from 'class-transformer';
import { RedirectionType } from '@entities';

export class NominationDto {
    @IsString()
    @IsOptional()
    @Expose()
    redirectionIdentifier?: string;

    @IsString()
    @IsOptional()
    @Expose()
    /**
     * This is used internally to track if the BRN has changed during the
     * current nomination. The reason for this is that we may change the
     * BRN during the upsert process before we go to the linking service
     * and we would like to be able to track this state
     */
    previousBrn?: string;

    @IsString()
    @IsOptional()
    @FixDate()
    @Expose()
    redirectionLetterSendDate?: string;

    @IsString()
    @IsOptional()
    @FixDate()
    @Expose()
    redirectionCompletionDate?: string;

    @IsBoolean()
    @IsOptional()
    @Expose()
    setRedirectionIdentifier?: boolean;

    @IsBoolean()
    @IsOptional()
    @Expose()
    setRedirectionCompletionDate?: boolean;

    @IsOptional()
    @Expose()
    @IsIn(Object.values(RedirectionType))
    /**
     * This is used to show the source of where the redirection
     * is coming from. If this comes from a crawler, it should
     * not have the same effect as if it were from an upload.
     */
    redirectionType?: RedirectionType;

    @IsNumber()
    @IsOptional()
    @Expose()
    paymentAmount?: number;

    @FixDate()
    @IsString()
    @IsOptional()
    @Expose()
    paymentDate?: string;

    @IsString()
    @Expose()
    @IsOptional()
    paymentReference?: string;

    @IsString()
    @Expose()
    @IsOptional()
    redirectionReference?: string;
}

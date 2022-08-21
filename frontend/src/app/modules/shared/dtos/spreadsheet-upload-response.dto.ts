import { ValidationError } from 'class-validator';

/**
 * U is the Create Dto for the entity
 */
export class VerifySpreadsheetUploadResponseDto<Entity> {
    valid: Entity[];
    invalid: { item: Entity; errors: Partial<ValidationError>[] }[];
}

export class UploadSpreadsheetResponseDto<Entity, CreateDto> {
    successful: Entity[];
    failed: {
        dto: CreateDto;
        reason?: string;
    }[];
}

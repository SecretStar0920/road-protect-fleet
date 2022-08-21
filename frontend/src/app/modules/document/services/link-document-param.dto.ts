import { IsDefined, IsIn, IsString } from 'class-validator';
import { DocumentLinkableTargets } from '@modules/document/services/document.service';

export class LinkDocumentParamDto {
    @IsString()
    @IsDefined()
    documentId: number;
    @IsIn(Object.values(DocumentLinkableTargets))
    @IsDefined()
    target: DocumentLinkableTargets;
    @IsString()
    @IsDefined()
    targetId: string;
}

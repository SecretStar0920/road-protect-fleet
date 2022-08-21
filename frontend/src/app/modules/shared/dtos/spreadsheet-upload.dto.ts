export class SpreadsheetUploadDto {
    headingMap: { [key: string]: string };
    method?: string; // FIXME, required
    additionalParameters?: any;
}

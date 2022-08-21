import { IsDefined, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { invert } from 'lodash';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Default } from '@modules/shared/helpers/default.transform';

export class SpreadsheetUploadDto {
    @IsDefined()
    @Transform((val) => invert(val))
    @ApiProperty({ description: 'The map of columns to columns' })
    headingMap: { [key: string]: string };

    @IsOptional()
    @Default([])
    @ApiProperty({ description: 'The raw spreadsheet data as a 2-dimensional array' })
    data: any[][];

    @IsDefined()
    @ApiProperty({ description: 'The method to apply to the batch data' })
    method: 'create' | 'update' | 'upsert' | 'manualRedirection' | 'uploadManualProof';

    @IsOptional()
    @ApiPropertyOptional({
        description:
            'Any additional parameters that you would like to upload with the spreadsheet in order to apply different business rules',
    })
    additionalParameters?: { timezone: string } & any;

    toJSONArray(): object[] {
        // map array of arrays
        const headings: string[] = this.data[0];
        const mappedData: object[] = [];
        for (let row = 1; row < this.data.length; row++) {
            if (this.data[row].length <= 0) {
                continue;
            }
            const item: any = {};
            for (let column = 0; column < headings.length; column++) {
                const heading = this.headingMap[headings[column]];
                if (!heading) {
                    continue;
                }
                item[heading] = this.data[row][column];
            }
            if (this.additionalParameters.timezone) {
                item.timezone = this.additionalParameters.timezone;
            }
            mappedData.push(item);
        }
        return mappedData;
    }
}

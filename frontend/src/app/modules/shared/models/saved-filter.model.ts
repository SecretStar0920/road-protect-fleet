import { Transform } from 'class-transformer';
import * as uuid from 'uuid';
import { IsDefined, IsString } from 'class-validator';
import { isEmpty } from 'lodash';
import { FilterOptions } from '@modules/shared/services/query-builder/advanced-query-filter.service';

export class SavedFilter {
    @Transform((val) => (!isEmpty(val) ? val : uuid()))
    id?: string;
    @IsString()
    name: string;
    @IsDefined()
    filter: FilterOptions;
}

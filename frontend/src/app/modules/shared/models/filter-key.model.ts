import { IsDefined, IsOptional } from 'class-validator';

/**
 * Used to determine filter visibility
 * Simple > Medium > Details
 */
export enum FilterKeyVisibility {
    Detailed,
    Simple,
    None,
}

export enum FilterKeyType {
    String = 'string',
    Number = 'number',
    Date = 'date',
    Dropdown = 'dropdown',
    Boolean = 'boolean',
    Existence = 'existence',
    ExactString = 'exactString',
}

export class FilterKey {
    @IsDefined()
    key: string; // Same key as column key

    @IsOptional()
    columnKey?: string; // For if it's not the same as the key (rare cases with more than 3 deep joins)
    // columnKey?: string = this.key; // For if it's not the same as the key (rare cases with more than 3 deep joins)

    @IsOptional()
    display?: string;
    @IsOptional()
    type?: FilterKeyType = FilterKeyType.String;
    @IsOptional()
    options?: any[];
    @IsOptional()
    visibility?: FilterKeyVisibility = FilterKeyVisibility.Detailed;
    @IsOptional()
    sortable?: boolean = true;

    @IsOptional()
    enableSearch?: boolean = false;
    @IsOptional()
    searchEntity?: string;
    @IsOptional()
    searchField?: string;
}

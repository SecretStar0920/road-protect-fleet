export interface PaginationResponseInterface<T> {
    data: T[];
    count: number;
    total: number;
    page: number;
    pageCount: number;
}

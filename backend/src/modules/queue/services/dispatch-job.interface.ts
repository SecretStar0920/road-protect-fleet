export interface DispatchJob<T = any> {
    type: string;
    data: T;
    uuid: string;
    userId?: number;
}

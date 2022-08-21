import { InfringementStatus } from '@entities';

export type IInfringementStatusTransition = {
    [key in InfringementStatus]?: InfringementStatus[];
};

import { createAction, props } from '@ngrx/store';
import {
    InfringementPredictionEndpoints,
    InfringementProjectionDataDto,
} from '@modules/infringement-projection/services/infringement-projection.service';

export const requestInfringementProjectionData = createAction(
    '[Infringement Projection] Request Infringement Projection Data',
    props<{ data: InfringementProjectionDataDto }>(),
);

export const clearInfringementProjectionData = createAction('[Infringement Projection] Clear Infringement Projection Data');

export const updateEndpoint = createAction(
    '[Infringement Projection] Update Endpoint',
    props<{ endpoint: InfringementPredictionEndpoints }>(),
);

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    graphingByIssuer,
    graphingByIssuerMappedData,
    graphingByIssuerPreviousYear,
    graphingByVehiclePreviousYear,
    graphingByVehiclePreviousYearMappedData,
    graphingByStatusPreviousYear,
    graphingByStatusPreviousYearMappedData,
    graphingByIssuerPreviousYearMappedData,
    graphingByStatusMappedData,
    graphingByVehicle,
    graphingByVehicleMappedData,
    graphingByStatus,
    graphingByIssuerGraphData,
    graphingByIssuerNumber,
    setShowOther,
    graphingByIssuerUpdateGraphData,
    graphingByVehicleGraphData,
    graphingByVehicleNumber,
} from '@modules/graphing/ngrx/graphing.actions';
import { map } from 'rxjs/operators';
import { GraphingDataManipulationService } from '@modules/graphing/services/graphing-data-manipulation.service';
import { GeneralCompositeKeyData } from '@modules/graphing/services/graphing-table.service';
import { GraphingByIssuerPageService } from '@modules/graphing/services/graphing-by-issuer-page.service';
import { GraphingByVehiclePageService } from '@modules/graphing/services/graphing-by-vehicle-page.service';

@Injectable()
export class GraphingEffects {
    constructor(
        private actions$: Actions,
        private graphingDataManipulationService: GraphingDataManipulationService,
        private graphingByIssuerPageService: GraphingByIssuerPageService,
        private graphingByVehiclePageService: GraphingByVehiclePageService,
    ) {}

    graphingByIssuerMappedData = createEffect(() => {
        return this.actions$.pipe(
            ofType(graphingByIssuer),
            map((action) => {
                const result: {
                    compositeObject: GeneralCompositeKeyData;
                    uniqueKeys: number;
                } = this.graphingDataManipulationService.generalisedMapToCompositeObject(action.data, 'name');
                return graphingByIssuerMappedData(result);
            }),
        );
    });

    graphingByVehicleGraphData = createEffect(() => {
        return this.actions$.pipe(
            ofType(graphingByVehicleMappedData),
            map((action) => {
                const data = this.graphingByVehiclePageService.initialiseVehicleData(action.compositeObject);
                return graphingByVehicleGraphData({ ...data });
            }),
        );
    });

    graphingByVehicleGraphDataRestriction = createEffect(() => {
        return this.actions$.pipe(
            ofType(graphingByVehicleNumber),
            map((action) => {
                const data = this.graphingByVehiclePageService.restrictNumberOfVehicles(action.groupedVehicles);
                return graphingByVehicleGraphData({ ...data });
            }),
        );
    });

    graphingByIssuerGraphData = createEffect(() => {
        return this.actions$.pipe(
            ofType(graphingByIssuerMappedData),
            map((action) => {
                const data = this.graphingByIssuerPageService.initialiseIssuerData(action.compositeObject);
                return graphingByIssuerGraphData({ ...data });
            }),
        );
    });

    graphingByIssuerGraphDataRestriction = createEffect(() => {
        return this.actions$.pipe(
            ofType(graphingByIssuerNumber),
            map((action) => {
                const data = this.graphingByIssuerPageService.restrictNumberOfIssuers(action.groupedIssuers);
                return graphingByIssuerGraphData({ ...data });
            }),
        );
    });

    graphingByIssuerChangeOthers = createEffect(() => {
        return this.actions$.pipe(
            ofType(setShowOther),
            map((action) => {
                const data = this.graphingByIssuerPageService.changeOthersShowing();
                return graphingByIssuerUpdateGraphData({ ...data });
            }),
        );
    });

    graphingByVehicleMappedData = createEffect(() => {
        return this.actions$.pipe(
            ofType(graphingByVehicle),
            map((action) => {
                const result: {
                    compositeObject: GeneralCompositeKeyData;
                    uniqueKeys: number;
                } = this.graphingDataManipulationService.generalisedMapToCompositeObject(action.data, 'registration');
                return graphingByVehicleMappedData(result);
            }),
        );
    });

    graphingByStatusMappedData = createEffect(() => {
        return this.actions$.pipe(
            ofType(graphingByStatus),
            map((action) => {
                const result: {
                    compositeObject: GeneralCompositeKeyData;
                    uniqueKeys: number;
                } = this.graphingDataManipulationService.generalisedMapToCompositeObject(action.data, 'status');
                return graphingByStatusMappedData({ data: result.compositeObject });
            }),
        );
    });

    graphingByStatusPreviousYearMappedData = createEffect(() => {
        return this.actions$.pipe(
            ofType(graphingByStatusPreviousYear),
            map((action) => {
                const result = this.graphingDataManipulationService.generalisedMapToCompositeObject(action.data, 'status');
                return graphingByStatusPreviousYearMappedData({ data: result.compositeObject, numberOfYears: action.numberOfYears });
            }),
        );
    });

    graphingByIssuerPreviousYearMappedData = createEffect(() => {
        return this.actions$.pipe(
            ofType(graphingByIssuerPreviousYear),
            map((action) => {
                const compositeObject: GeneralCompositeKeyData = this.graphingDataManipulationService.mapToCompositeObject(action.data);
                return graphingByIssuerPreviousYearMappedData({ data: compositeObject, numberOfYears: action.numberOfYears });
            }),
        );
    });

    graphingByVehiclePreviousYearMapped = createEffect(() => {
        return this.actions$.pipe(
            ofType(graphingByVehiclePreviousYear),
            map((action) => {
                const result = this.graphingDataManipulationService.generalisedMapToCompositeObject(action.data, 'registration');
                return graphingByVehiclePreviousYearMappedData({ data: result.compositeObject, numberOfYears: action.numberOfYears });
            }),
        );
    });
}

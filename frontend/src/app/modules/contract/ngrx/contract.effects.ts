import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { VehicleService } from '@modules/vehicle/services/vehicle.service';
import { has } from 'lodash';
import { contractNgrxHelper, ContractState } from '@modules/contract/ngrx/contract.reducer';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { bulkOcr, contractLoading } from '@modules/contract/ngrx/contract.actions';
import { ContractService } from '@modules/contract/services/contract.service';

@Injectable()
export class ContractEffects {
    // When an a vehicle contract is added we want to update the vehicle too
    $onLeaseAddition = createEffect(
        () =>
            this.actions$.pipe(
                ofType(contractNgrxHelper.addOne),
                tap((result) => {
                    if (has(result, 'payload.contract.vehicle.vehicleId')) {
                        this.vehicleService.getVehicle(result.item.vehicle.vehicleId).subscribe();
                    }
                }),
            ),
        { dispatch: false },
    );

    // TODO: Fix contract removal update vehicle
    // // When an a vehicle contract is removed we want to update the vehicle too
    // $onLeaseRemoval = createEffect(
    //     () =>
    //         this.actions$.pipe(
    //             ofType(contractNgrxHelper.deleteOne),
    //             tap((result) => {
    //                 if (has(result, 'payload.contract.vehicle.vehicleId')) {
    //                     this.vehicleService.getVehicle(result.item.vehicle.vehicleId).subscribe();
    //                 }
    //             }),
    //         ),
    //     { dispatch: false },
    // );

    bulkOcr = createEffect(() => {
        return this.actions$.pipe(
            ofType(bulkOcr),
            mergeMap((action) => {
                this.store.dispatch(contractLoading({ loading: true }));
                return this.contractService.runBulkContractOcr(action.contractIds).pipe(
                    map((result) => {
                        this.store.dispatch(contractNgrxHelper.setSelectedRowIds({ ids: [] }));
                        return contractLoading({ loading: false });
                    }),
                    catchError((error) => of(contractLoading({ loading: false }))),
                );
            }),
        );
    });

    constructor(
        private actions$: Actions,
        private router: Router,
        private vehicleService: VehicleService,
        private contractService: ContractService,
        private store: Store<ContractState>,
    ) {}
}

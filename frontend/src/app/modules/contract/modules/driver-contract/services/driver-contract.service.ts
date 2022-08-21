import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import { contractNgrxHelper, ContractState } from '@modules/contract/ngrx/contract.reducer';
import { CreateDriverContractDto } from '@modules/contract/modules/driver-contract/services/create-driver-contract.dto';
import { DriverContract } from '@modules/shared/models/entities/contract.model';

@Injectable({
    providedIn: 'root',
})
export class DriverContractService {
    constructor(private http: HttpService, private store: Store<ContractState>) {}

    getAllDriverContracts() {
        return this.http.getSecure('driver-contract').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(DriverContract, item));
                }
                return [];
            }),
            tap((driverContracts) => {
                this.store.dispatch(contractNgrxHelper.addMany({ items: driverContracts }));
            }),
        );
    }

    getDriverContract(contractId: number) {
        return this.http.getSecure(`driver-contract/${contractId}`).pipe(
            map((response: object) => {
                return plainToClass(DriverContract, response);
            }),
            tap((driverContract) => {
                this.store.dispatch(contractNgrxHelper.upsertOne({ item: driverContract }));
            }),
        );
    }

    createDriverContract(dto: CreateDriverContractDto): Observable<DriverContract> {
        return this.http.postSecure('driver-contract', dto).pipe(
            map((response: object) => {
                return plainToClass(DriverContract, response);
            }),
            tap((result) => {
                this.store.dispatch(contractNgrxHelper.addOne({ item: result }));
            }),
        );
    }
}

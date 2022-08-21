import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import { LeaseContract } from '@modules/shared/models/entities/contract.model';
import { CreateLeaseContractDto } from '@modules/contract/modules/lease-contract/services/create-lease-contract.dto';
import { contractNgrxHelper, ContractState } from '@modules/contract/ngrx/contract.reducer';

@Injectable({
    providedIn: 'root',
})
export class LeaseContractService {
    constructor(private http: HttpService, private store: Store<ContractState>) {}

    getAllLeaseContracts() {
        return this.http.getSecure('lease-contract').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(LeaseContract, item));
                }
                return [];
            }),
            tap((leaseContracts) => {
                this.store.dispatch(contractNgrxHelper.addMany({ items: leaseContracts }));
            }),
        );
    }

    getLeaseContract(contractId: number) {
        return this.http.getSecure(`lease-contract/${contractId}`).pipe(
            map((response: object) => {
                return plainToClass(LeaseContract, response);
            }),
            tap((leaseContract) => {
                this.store.dispatch(contractNgrxHelper.upsertOne({ item: leaseContract }));
            }),
        );
    }

    createLeaseContract(dto: CreateLeaseContractDto): Observable<LeaseContract> {
        return this.http.postSecure('lease-contract', dto).pipe(
            map((response: object) => {
                return plainToClass(LeaseContract, response);
            }),
            tap((result) => {
                this.store.dispatch(contractNgrxHelper.addOne({ item: result }));
            }),
        );
    }
}

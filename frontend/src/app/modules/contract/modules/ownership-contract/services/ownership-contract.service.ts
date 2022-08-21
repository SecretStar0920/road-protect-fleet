import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import { OwnershipContract } from '@modules/shared/models/entities/contract.model';
import { CreateOwnershipContractDto } from '@modules/contract/modules/ownership-contract/services/create-ownership-contract.dto';
import { contractNgrxHelper, ContractState } from '@modules/contract/ngrx/contract.reducer';

@Injectable({
    providedIn: 'root',
})
export class OwnershipContractService {
    constructor(private http: HttpService, private store: Store<ContractState>) {}

    getAllOwnershipContracts() {
        return this.http.getSecure('ownership-contract').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(OwnershipContract, item));
                }
                return [];
            }),
            tap((ownershipContracts) => {
                this.store.dispatch(contractNgrxHelper.addMany({ items: ownershipContracts }));
            }),
        );
    }

    getOwnershipContract(contractId: number) {
        return this.http.getSecure(`ownership-contract/${contractId}`).pipe(
            map((response: object) => {
                return plainToClass(OwnershipContract, response);
            }),
            tap((ownershipContract) => {
                this.store.dispatch(contractNgrxHelper.upsertOne({ item: ownershipContract }));
            }),
        );
    }

    createOwnershipContract(dto: CreateOwnershipContractDto): Observable<OwnershipContract> {
        return this.http.postSecure('ownership-contract', dto).pipe(
            map((response: object) => {
                return plainToClass(OwnershipContract, response);
            }),
            tap((result) => {
                this.store.dispatch(contractNgrxHelper.addOne({ item: result }));
            }),
        );
    }
}

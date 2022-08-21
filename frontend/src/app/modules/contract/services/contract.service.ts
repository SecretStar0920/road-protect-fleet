import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, takeUntil, tap } from 'rxjs/operators';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { contractNgrxHelper, ContractState } from '@modules/contract/ngrx/contract.reducer';
import { plainToClass } from 'class-transformer';
import { UpdateContractDocumentDto, UpdateContractEndDateDto } from '@modules/contract/services/update-contract.dto';
import { IsDateString, IsDefined, IsOptional } from 'class-validator';
import { Document } from '@modules/shared/models/entities/document.model';
import { documentNgrxHelper } from '@modules/document/ngrx/document.reducer';
import { VehicleService } from '@modules/vehicle/services/vehicle.service';

export class CreateContractForVehicleDto {
    @IsDateString()
    startDate: string;
    @IsDateString()
    endDate: string;
    @IsOptional()
    user?: number | string;
    @IsOptional()
    owner?: number | string;
    @IsDefined()
    vehicle: number | string;
}

@Injectable({
    providedIn: 'root',
})
export class ContractService {
    private destroy$ = new Subject();
    constructor(private http: HttpService, private store: Store<ContractState>, private vehicleService: VehicleService) {}

    getAllContracts() {
        return this.http.getSecure('contract').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Contract, item));
                }
                return [];
            }),
            tap((contracts) => {
                this.store.dispatch(contractNgrxHelper.addMany({ items: contracts }));
            }),
        );
    }

    getContractsForVehicle(vehicleId: number) {
        return this.http.getSecure(`contract/vehicle/${vehicleId}`).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Contract, item));
                }
                return [];
            }),
            tap((contracts) => {
                this.store.dispatch(contractNgrxHelper.addMany({ items: contracts }));
            }),
        );
    }

    getContract(contractId: number) {
        return this.http.getSecure(`contract/${contractId}`).pipe(
            map((response: object) => {
                return plainToClass(Contract, response);
            }),
            tap((contract) => {
                this.store.dispatch(contractNgrxHelper.upsertOne({ item: contract }));
            }),
        );
    }

    updateContractOcrStatus(contractId: number) {
        return this.http.getSecure(`contract/ocr/${contractId}`).pipe(
            map((response: object) => {
                return plainToClass(Contract, response);
            }),
            tap((contract) => {
                this.store.dispatch(contractNgrxHelper.upsertOne({ item: contract }));
            }),
        );
    }

    runContractOcr(contractId: number) {
        return this.http.getSecure(`contract/ocr/run/${contractId}`).pipe(
            map((response: object) => {
                return plainToClass(Contract, response);
            }),
            tap((contract) => {
                this.store.dispatch(contractNgrxHelper.upsertOne({ item: contract }));
            }),
        );
    }

    runBulkContractOcr(contractIds: number[]) {
        return this.http.postSecure(`contract/ocr/run/bulk`, { contractIds }).pipe(
            map((response: Contract[]) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Contract, item));
                }
                return [];
            }),
            tap((contracts) => {
                this.store.dispatch(contractNgrxHelper.upsertMany({ items: contracts }));
            }),
        );
    }

    createContract(dto: CreateContractForVehicleDto): Observable<Contract> {
        return this.http.postSecure(`contract`, dto).pipe(
            map((response: object) => {
                return plainToClass(Contract, response);
            }),
            tap((result) => {
                this.store.dispatch(contractNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    UpdateContractDocument(id: number, dto: UpdateContractDocumentDto): Observable<Contract> {
        return this.http.postSecure(`contract/${id}/document`, dto).pipe(
            map((response: object) => {
                return plainToClass(Contract, response);
            }),
            tap((result) => {
                this.store.dispatch(
                    contractNgrxHelper.updateOne({
                        item: {
                            id: result.contractId,
                            changes: result,
                        },
                    }),
                );
            }),
        );
    }

    UpdateContractEndDate(id: number, dto: UpdateContractEndDateDto): Observable<Contract> {
        return this.http.postSecure(`contract/${id}/end-date`, dto).pipe(
            map((response: object) => {
                return plainToClass(Contract, response);
            }),
            tap((result) => {
                this.store.dispatch(
                    contractNgrxHelper.updateOne({
                        item: {
                            id: result.contractId,
                            changes: result,
                        },
                    }),
                );
            }),
        );
    }

    deleteContract(contractId: number) {
        return this.http.deleteSecure(`contract/${contractId}`).pipe(
            map((response: object) => {
                return plainToClass(Contract, response);
            }),
            tap((contract) => {
                this.store.dispatch(contractNgrxHelper.deleteOne({ id: `${contract.contractId}` }));
                if (contract.vehicle) {
                    this.vehicleService.getVehicle(contract.vehicle.vehicleId).pipe(takeUntil(this.destroy$)).subscribe();
                }
            }),
        );
    }

    bulkGenerateLeaseContractDocuments(contractIds: (number | string)[] = [], representativeDetails: string) {
        return this.http.postSecure(`contract/generate-lease-contract-documents`, { contractIds, representativeDetails }).pipe(
            map((response: object) => {
                return plainToClass(Document, response);
            }),
            tap((document) => {
                this.store.dispatch(documentNgrxHelper.upsertOne({ item: document }));
            }),
        );
    }
}

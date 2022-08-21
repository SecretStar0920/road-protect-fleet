import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Location } from '@modules/shared/models/entities/location.model';
import { LocationService } from '@modules/location/services/location.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import i18next from 'i18next';

@Component({
    selector: 'rp-delete-location',
    templateUrl: './delete-location.component.html',
    styleUrls: ['./delete-location.component.less'],
})
export class DeleteLocationComponent implements OnInit {
    @Input() locationId: number;

    deleteLocationState: ElementStateModel<Location> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Location>> = new EventEmitter();

    constructor(private locationService: LocationService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deleteLocationState.submit();
        this.locationService.deleteLocation(this.locationId).subscribe(
            (location) => {
                this.deleteLocationState.onSuccess(i18next.t('delete-location.success'), location);
                this.message.success(this.deleteLocationState.successResult().message);
                this.delete.emit(this.deleteLocationState);
            },
            (error) => {
                this.deleteLocationState.onFailure(i18next.t('delete-location.fail'), error);
                this.message.error(this.deleteLocationState.failedResult().message);
            },
        );
    }
}

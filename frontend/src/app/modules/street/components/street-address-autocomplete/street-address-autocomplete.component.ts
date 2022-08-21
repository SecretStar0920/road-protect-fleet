import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { PhysicalLocation } from '@modules/shared/models/entities/location.model';
import { Street } from '@modules/shared/models/entities/street.model';
import { StreetService } from '@modules/street/services/street.service';
import { filter, find } from 'lodash';

@Component({
    selector: 'rp-street-address-autocomplete',
    templateUrl: './street-address-autocomplete.component.html',
    styleUrls: ['./street-address-autocomplete.component.less'],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class StreetAddressAutocompleteComponent implements OnInit {
    @Input() initialAddress: PhysicalLocation;
    streets: Street[];
    parentForm: FormGroup;
    addressForm: FormGroup;
    cities: string[];
    filteredCities: string[];

    constructor(private controlContainer: ControlContainer, private streetService: StreetService) {}

    ngOnInit() {
        this.parentForm = this.controlContainer.control as FormGroup;

        this.addressForm = new FormGroup({
            street: new FormControl(null, Validators.required),
            streetName: new FormControl(null, Validators.required),
            streetNumber: new FormControl(null, Validators.required),
            city: new FormControl(null, Validators.required),
            country: new FormControl(null, Validators.required),
            code: new FormControl(null),
        });
        this.parentForm.addControl('physicalLocation', this.addressForm);

        this.initialiseCities();
        this.initialiseStreets();

        if (this.initialAddress) {
            this.addressForm.get('streetName').setValue(this.initialAddress.streetName);
            this.addressForm.get('streetNumber').setValue(this.initialAddress.streetNumber);
            this.addressForm.get('city').setValue(this.initialAddress.city);
            this.addressForm.get('country').setValue(this.initialAddress.country);
            this.addressForm.get('code').setValue(this.initialAddress.code);
        }
    }

    initialiseStreets() {
        const city = this.initialAddress ? this.initialAddress.city : null;
        const initialStreetName = this.initialAddress ? this.initialAddress.streetName : null;

        this.streetService.getStreets(initialStreetName, city).subscribe((streets) => {
            this.streets = streets;
            if (initialStreetName) {
                const initialStreet = find(streets, (retrievedStreet) => retrievedStreet.name === initialStreetName);
                this.addressForm.get('street').setValue(initialStreet);
            }
            this.filterCities();
        });
    }

    getStreets(searchStreet?: string) {
        const city = this.addressForm.get('city').value;

        if (!city) {
            this.addressForm.get('street').setValue(null);
        }
        this.streetService.getStreets(searchStreet, city).subscribe((streets) => {
            this.streets = streets;
        });
    }

    initialiseCities() {
        this.streetService.getAllCities().subscribe((cities) => {
            this.cities = cities;
            this.filteredCities = cities;
        });
    }

    filterCities() {
        const selectedStreet: Street = this.addressForm.get('street').value;
        const streetName = selectedStreet ? selectedStreet.name : null;
        this.addressForm.get('streetName').setValue(streetName);

        if (!selectedStreet) {
            this.filteredCities = this.cities;
            return;
        }

        this.filteredCities = filter(this.cities, (city) => {
            return city === selectedStreet.issuer;
        });

        if (this.filteredCities.length === 1) {
            this.addressForm.get('city').setValue(this.filteredCities[0]);
        }
    }
}

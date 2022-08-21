import { ATGVehicleRequest } from '@integrations/automation/models/atg-vehicle-details.model';
import { VehicleAutomationIntegration } from '@integrations/automation/vehicle/vehicle.automation-integration';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AddVehicleAutomationIntegration extends TestableIntegration {
    private vehicleIntegration = new VehicleAutomationIntegration();

    runTest(dto: ATGVehicleRequest) {
        return this.vehicleIntegration.addVehicle(dto);
    }

    getBody(dto: ATGVehicleRequest) {
        return this.vehicleIntegration.getBody(dto);
    }
}

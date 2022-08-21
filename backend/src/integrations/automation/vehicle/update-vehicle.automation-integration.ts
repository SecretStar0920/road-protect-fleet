import { ATGVehicleRequest } from '@integrations/automation/models/atg-vehicle-details.model';
import { VehicleAutomationIntegration } from '@integrations/automation/vehicle/vehicle.automation-integration';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateVehicleAutomationIntegration extends TestableIntegration {
    private vehicleIntegration = new VehicleAutomationIntegration();

    runTest(dto: ATGVehicleRequest) {
        return this.vehicleIntegration.updateVehicle(dto);
    }

    getBody(dto: ATGVehicleRequest) {
        return this.vehicleIntegration.getBody(dto);
    }
}

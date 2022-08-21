import { Module } from '@nestjs/common';
import { DriverController } from '@modules/driver/controller/driver.controller';
import { DriverQueryController } from '@modules/driver/controller/driver-query.controller';
import { DriverSpreadsheetController } from '@modules/driver/controller/driver-spreadsheet.controller';
import { CreateDriverService } from '@modules/driver/services/create-driver.service';
import { CreateDriverSpreadsheetService } from '@modules/driver/services/create-driver-spreadsheet.service';
import { DeleteDriverService } from '@modules/driver/services/delete-driver.service';
import { LocationModule } from '@modules/location/location.module';
import { GetDriverService } from '@modules/driver/services/get-driver.service';

@Module({
    controllers: [DriverController, DriverQueryController, DriverSpreadsheetController],
    providers: [CreateDriverService, CreateDriverSpreadsheetService, DeleteDriverService, GetDriverService],
    exports: [],
    imports: [LocationModule],
})
export class DriverModule {}

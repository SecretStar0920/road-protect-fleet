import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { Logger } from '@logger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsOptional, IsString } from 'class-validator';
import { Config } from '@config/config';

export class SendFaxDto {
    @ApiModelProperty()
    @IsString()
    faxNumber: string;

    @ApiModelProperty()
    @IsString()
    @IsOptional()
    fileUrl: string;
}

@Injectable()
export class SendFaxService {
    constructor(private logger: Logger) {}

    public async sendFax(details: SendFaxDto) {
        this.logger.debug({ message: 'Sending fax', detail: details, fn: this.sendFax.name });
        const { email, password } = Config.get.fax;
        const { faxNumber, fileUrl } = details;

        const params = new URLSearchParams();
        params.append('email', email);
        params.append('password', password);
        params.append('faxNumber', faxNumber);
        params.append('fileURL', fileUrl);

        if (Config.get.isProduction()) {
            this.logger.debug({ message: 'Fax params', detail: params, fn: this.sendFax.name });
            const response = await Axios.post(Config.get.fax.api.send, params);
            const responseData = await parseStringPromise(response.data);
            this.logger.debug({ message: 'Received response', detail: responseData, fn: this.sendFax.name });
            return responseData;
        } else {
            this.logger.debug({ message: 'Mock Fax details', detail: params, fn: this.sendFax.name });
        }
    }

    // Requires a job that runs in the backgound after the fax was sent to check its status.
    // Not yet implemented.
    public checkStatus(faxCode: string) {
        const { email, password } = Config.get.fax;
        return Axios.post(Config.get.fax.api.checkStatus, { email, password, faxCode });
    }
}

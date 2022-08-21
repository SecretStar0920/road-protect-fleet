import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { CheckFeatureFlagParams, FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';
import { Reflector } from '@nestjs/core';
import { Logger } from '@logger';

// tslint:disable-next-line:variable-name
export const FeatureFlagMetadata = ({ title, defaultEnabled = true, disabledMessage = 'Feature disabled' }: CheckFeatureFlagParams) =>
    SetMetadata('featureFlag', { title, defaultEnabled, disabledMessage });

@Injectable()
export class FeatureFlagGuard implements CanActivate {
    constructor(private reflector: Reflector, private logger: Logger) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.debug({ message: 'Checking feature flag', detail: 'Checking feature flag', fn: this.canActivate.name });

        const featureFlag = this.reflector.get<CheckFeatureFlagParams>('featureFlag', context.getHandler());
        if (!featureFlag) {
            this.logger.debug({ message: 'Feature flag is ok', detail: '', fn: this.canActivate.name });
            return true;
        }
        let result = await FeatureFlagHelper.isEnabledOrThrow(featureFlag);

        this.logger.debug({ message: `Feature flag res is ${result}`, detail: '', fn: this.canActivate.name });

        return result;
    }
}

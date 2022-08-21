import { FeatureFlag } from '@entities';
import { isNil } from 'lodash';
import { ForbiddenException } from '@nestjs/common';

export interface CheckFeatureFlagParams {
    title: string;
    defaultEnabled?: boolean;
    disabledMessage?: string;
}

export class FeatureFlagHelper {
    static async getFeatureFlag({
        title,
        defaultEnabled = true,
        disabledMessage = 'Feature disabled',
    }: CheckFeatureFlagParams): Promise<FeatureFlag> {
        const featureFlag = await FeatureFlag.createQueryBuilder('flag').andWhere('flag.title = :title', { title }).getOne();

        if (isNil(featureFlag)) {
            return FeatureFlag.create({
                title,
                enabled: defaultEnabled,
                disabledMessage,
            }).save();
        }

        return featureFlag;
    }

    static async createTestFeature(title: string) {
        const params = { title, defaultEnabled: true, disabledMessage: 'Feature disabled' };
        const featureFlag = await this.getFeatureFlag(params);
        featureFlag.enabled = true;
        await featureFlag.save();
        return featureFlag;
    }

    static async isEnabled({
        title,
        defaultEnabled = true,
        disabledMessage = 'Feature disabled',
    }: CheckFeatureFlagParams): Promise<boolean> {
        const params = { title, defaultEnabled, disabledMessage };
        const featureFlag = await this.getFeatureFlag(params);
        return featureFlag.enabled;
    }

    static async isEnabledOrThrow({
        title,
        defaultEnabled = true,
        disabledMessage = 'Feature disabled',
    }: CheckFeatureFlagParams): Promise<boolean> {
        const params = { title, defaultEnabled, disabledMessage };
        const featureFlag = await this.getFeatureFlag(params);
        if (!featureFlag.enabled) {
            throw new ForbiddenException({ message: featureFlag.disabledMessage || params.disabledMessage });
        } else {
            return true;
        }
    }
}

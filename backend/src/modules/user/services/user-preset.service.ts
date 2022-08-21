import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { User, UserPreset } from '@entities';
import { UpsertUserPresetDto } from '@modules/user/controllers/user-preset.controller';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class UserPresetService {
    constructor(private logger: Logger) {}

    async getUserPreset(userId: number): Promise<UserPreset> {
        this.logger.log({ message: `Getting user preset`, detail: userId, fn: this.getUserPreset.name });
        const user = await User.findOne(userId);
        if (!user) {
            throw new BadRequestException({ message: ERROR_CODES.E060_UserNotFound.message({ userId }) });
        }
        return user.frontendUserPreferences;
    }

    async deleteUserPreset(userId: number, dto: UpsertUserPresetDto): Promise<UserPreset> {
        this.logger.log({ message: `Deleting  user preference`, detail: dto, fn: this.deleteUserPreset.name });
        const user = await User.findOne(userId);
        if (!user) {
            throw new BadRequestException({ message: ERROR_CODES.E060_UserNotFound.message({ userId }) });
        }
        const tablePresets = user.frontendUserPreferences[dto.currentTable];
        const filteredResults = tablePresets.filter((preset) => preset.id !== dto.preset.id);
        user.frontendUserPreferences[dto.currentTable] = filteredResults;
        await user.save();
        return user.frontendUserPreferences;
    }

    async upsertUserPreset(userId: number, dto: UpsertUserPresetDto): Promise<UserPreset> {
        this.logger.log({ message: 'Upserting user preset: ', detail: dto, fn: this.upsertUserPreset.name });
        const user = await User.findOne(userId);
        if (!user) {
            throw new BadRequestException({ message: ERROR_CODES.E060_UserNotFound.message({ userId }) });
        }
        const tablePresets = user.frontendUserPreferences[dto.currentTable];
        const presetIndex = tablePresets?.findIndex((preset) => preset.id === dto.preset.id);

        if (!tablePresets) {
            // No presets exist for the table
            dto.preset.id = 1;
            user.frontendUserPreferences[dto.currentTable] = [dto.preset];
        } else if (presetIndex < 0) {
            // Preset does not exist
            const highestId = tablePresets.reduce((a, b) => (a.id > b.id ? a : b));
            dto.preset.id = highestId.id + 1;
            user.frontendUserPreferences[dto.currentTable].push(dto.preset);
        } else {
            // Preset exists
            tablePresets[presetIndex] = dto.preset;
            user.frontendUserPreferences[dto.currentTable] = tablePresets;
        }
        // Update defaults if needed
        if (dto.preset.default) {
            user.frontendUserPreferences[dto.currentTable].map((tab) => {
                dto.preset.id === tab.id ? (tab.default = dto.preset.default) : (tab.default = false);
            });
        }
        await user.save();
        return user.frontendUserPreferences;
    }
}

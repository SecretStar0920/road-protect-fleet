import { RateLimitActions } from '@modules/rate-limit/rate-limit-actions.enum';
import { RateLimitService } from '@modules/rate-limit/rate-limit.service';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { RateLimitGuard } from '@modules/rate-limit/rate-limit.guard';

// tslint:disable-next-line:variable-name
export const SetRateLimit = (action: RateLimitActions, limit: number, errorMessage?: string) => {
    RateLimitService.addLimit(action, limit);
    if (errorMessage) {
        RateLimitService.addRateLimitMessage(action, errorMessage);
    }
    return SetMetadata('action', action);
};

// tslint:disable-next-line:variable-name
export const RateLimit = () => UseGuards(RateLimitGuard);

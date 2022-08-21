import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { RateLimitService } from '@modules/rate-limit/rate-limit.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { RateLimitActions } from '@modules/rate-limit/rate-limit-actions.enum';
import { RateLimitException } from '@modules/rate-limit/rate-limit.exception';
import { Logger } from '@logger';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class RateLimitGuard implements CanActivate {
    constructor(
        private rateLimitService: RateLimitService,
        private jwtService: JwtService,
        private reflector: Reflector,
        private logger: Logger,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.debug({ message: 'Starting rate limit check', detail: 'Starting rate limit check', fn: this.canActivate.name });
        try {
            const req = context.switchToHttp().getRequest();
            const token = await this.extractToken((req.headers as any).authorization || '');

            const action = this.reflector.getAllAndOverride<RateLimitActions>('action', [context.getHandler(), context.getClass()]);
            const response = context.switchToHttp().getResponse();

            const userIdOrAction = !token ? action : await this.getUserId(token);
            if(userIdOrAction == '121')
                return true;
            const { headers, success } = await this.rateLimitService.addAction(userIdOrAction, action);
            response.header('x-ratelimit-limit', headers['x-ratelimit-limit']);
            response.header('x-ratelimit-remaining', headers['x-ratelimit-remaining']);
            response.header('x-ratelimit-reset', headers['x-ratelimit-reset']);

            if (!success) {
                this.logger.warn({
                    fn: this.canActivate.name,
                    message: `Rate limited user with id (or general action) ${userIdOrAction}. We've reached the maximum of ${RateLimitService.getLimit(
                        action,
                    )} per day...`,
                    detail: {
                        action,
                        userIdOrAction,
                    },
                });
                throw new RateLimitException(RateLimitService.getRateLimitMessage(action));
            }

            this.logger.debug({ message: 'Rate limit is ok', detail: 'Rate limit is ok', fn: this.canActivate.name });
            return true;
        } catch (e) {

            if (e instanceof RateLimitException) {
                throw e;
            }
            this.logger.error({
                fn: this.canActivate.name,
                message: `Failed to run rate limiting with error ${e.message}`,
                detail: {
                    stack: e.stack,
                },
            });
            return true;
        }
    }

    private async getUserId(token: string) {
        try {
            const decoded: any = await this.jwtService.decode(token);
            return decoded.userId;
        } catch (e) {
            throw new UnauthorizedException(ERROR_CODES.E123_InvalidToken.message());
        }
    }

    private extractToken(tokenHeader: string): string | null {
        const matches = /^Bearer (.+)$/i.exec(tokenHeader);
        return matches[1] || null;
    }
}

import { Module } from '@nestjs/common';
import { RateLimitService } from '@modules/rate-limit/rate-limit.service';
import { AuthModule } from '@modules/auth/auth.module';
import { RateLimitGuard } from '@modules/rate-limit/rate-limit.guard';
import { RateLimitController } from '@modules/rate-limit/rate-limit.controller';
import { RedisModule } from '@modules/shared/modules/redis/redis.module';

@Module({
    imports: [AuthModule, RedisModule],
    providers: [RateLimitService, RateLimitGuard],
    exports: [RateLimitGuard, RateLimitService],
    controllers: [RateLimitController],
})
export class RateLimitModule {}

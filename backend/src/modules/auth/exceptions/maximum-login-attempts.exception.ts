import { UnauthorizedException } from '@nestjs/common';

export class MaximumLoginAttemptsException extends UnauthorizedException {}

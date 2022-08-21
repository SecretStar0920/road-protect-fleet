import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MicroserviceGuard implements CanActivate {
    constructor(private serviceName: string) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        // TODO: improve security on this somehow
        return request.headers['service-name'] === this.serviceName;
    }
}

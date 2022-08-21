import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { forEach, get } from 'lodash';
import { Logger } from '@logger';

export function databaseExceptionHelper(
    e: any,
    constraints: IDatabaseConstraints,
    unknownErrorMessage: string = 'Failed to perform that action, please contact support.',
) {
    const constraint = get(e, 'constraint', null);
    const message = get(e, 'message', null);

    // For each key in constraints check if constraint from error matches and throw the correct error
    forEach(constraints, (val, key) => {
        if (constraint === val.constraint) {
            throw new BadRequestException(val.description);
        }
    });

    Logger.instance.error({ message: 'Database constraint failure uncaught', detail: e, fn: this.databaseExceptionHelper.name });
    if (message) {
        throw new InternalServerErrorException({ message, error: e });
    } else {
        throw new InternalServerErrorException({ message: unknownErrorMessage, error: e });
    }
}

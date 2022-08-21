import { BadRequestException } from '@nestjs/common';
import { Logger } from '@logger';
import { forEach } from 'lodash';
import { ValidationError } from 'class-validator';

const logger = Logger.instance;

export const validatorExceptionFactory: (errors: ValidationError[]) => any = (errors) => {
    logger.warn({ message: 'Validation errors occurred', detail: errors.map((e) => e.toString(true)), fn: validatorExceptionFactory.name });
    const messages: string[] = [];
    errors.forEach((error: ValidationError) => {
        messages.push(validationErrorToString(error));
    });
    return new BadRequestException(messages.join('\n'));
};

export const validatorExceptionFactoryStringArray: (errors: ValidationError[]) => string[] = (errors) => {
    const messages: string[] = [];
    errors.forEach((error: ValidationError) => {
        messages.push(validationErrorToString(error));
    });
    return messages;
};

export const validatorExceptionFactoryString: (errors: ValidationError[]) => string = (errors) => {
    return this.validatorExceptionFactoryStringArray(errors).join('\n');
};

const validationErrorToString = (error: ValidationError): string => {
    let message = '';
    if (error.children.length > 0) {
        message = message + '\n' + validatorExceptionFactoryString(error.children);
    } else {
        message = message + `Field ${error.property} has an issue: `;
        forEach(error.constraints, (value, key) => {
            message = message + `\n${value.replace(/\$value/g, error.value)}`;
        });
    }
    return message;
};

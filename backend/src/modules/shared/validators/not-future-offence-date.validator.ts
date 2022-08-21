import { Validate, ValidationArguments, ValidatorConstraint } from 'class-validator';
import { fixDate } from '@modules/shared/helpers/fix-date';
import { Config } from '@config/config';
import * as moment from 'moment';

@ValidatorConstraint({
    name: 'offenceDate',
    async: false,
})
export class NotFutureOffenceDateValidator {
    validate(text: string, args: ValidationArguments) {
        const fixedDate = fixDate(text, ((args.object as any) || {}).timezone || Config.get.app.timezone, true);
        if (!fixedDate) {
            return true;
        }

        const date = moment(fixedDate);

        return moment().isSameOrAfter(date);
    }

    defaultMessage(args: ValidationArguments) {
        // here you can provide default error message if validation failed
        return 'Offence date ($value) is in the future!';
    }
}

export const NotFutureOffenceDate = () => Validate(NotFutureOffenceDateValidator);

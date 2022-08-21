import * as moment from 'moment';

export function momentTransform(val) {
    try {
        return moment(val).isValid() ? moment(val) : null;
    } catch (e) {
        return null;
    }
}

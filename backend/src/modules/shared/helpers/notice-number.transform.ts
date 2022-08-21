import { Transform } from 'class-transformer';
import { asNoticeNumber } from '@modules/shared/helpers/dto-transforms';

export function NoticeNumber(): PropertyDecorator {
    return Transform((value: string) => asNoticeNumber(value));
}

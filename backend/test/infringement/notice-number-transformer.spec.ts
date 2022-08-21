import { asNoticeNumber } from '@modules/shared/helpers/dto-transforms';
import { plainToClass } from 'class-transformer';
import { UpsertInfringementDto } from '@modules/infringement/controllers/upsert-infringement.dto';

describe(`Notice Number Transformer`, () => {
    it(`It leaves correct notice numbers the same`, () => {
        expect(asNoticeNumber('9001321')).toEqual('9001321');
    });

    it(`It removes the leading zeros`, () => {
        expect(asNoticeNumber('09001321')).toEqual('9001321');
        expect(asNoticeNumber('009001321')).toEqual('9001321');
        expect(asNoticeNumber('0009001321')).toEqual('9001321');
    });

    it(`Removes standard characters`, () => {
        expect(asNoticeNumber('A9001321')).toEqual('9001321');
    });

    it(`Removes special characters`, () => {
        expect(asNoticeNumber('\t9001321')).toEqual('9001321');
    });

    it(`Converts the dto correctly`, () => {
        const dto = plainToClass(UpsertInfringementDto, {
            noticeNumber: '9001321',
        });
        expect(dto.noticeNumber).toEqual('9001321');

        const dto2 = plainToClass(UpsertInfringementDto, {
            noticeNumber: '\t9001321\n',
        });
        expect(dto2.noticeNumber).toEqual('9001321');
    });
});

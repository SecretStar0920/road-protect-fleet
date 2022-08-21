import { Injectable } from '@nestjs/common';
import { Infringement, Log, LogPriority, LogType } from '@entities';
import { Promax } from 'promax';
import { asNoticeNumber } from '@modules/shared/helpers/dto-transforms';
import { Config } from '@config/config';

@Injectable()
export class FixInfringementDataService {
    async fixInvalidPrefixInfringements() {
        const allInfringements = await Infringement.find();
        const infringements = allInfringements.filter((infringement) => /^C.+0$/.test(infringement.noticeNumber.toString()));
        const promax = Promax.create(10, {
            throws: false,
        });
        promax.add(
            infringements.map((infringement) => async () => {
                const originalNumber = infringement.noticeNumber;
                const matches = /^C(.+)0$/.exec(originalNumber);
                infringement.noticeNumber = matches[1];
                await infringement.save();
                await Log.createAndSave({
                    infringement,
                    priority: LogPriority.Low,
                    type: LogType.Updated,
                    message: `Modified the notice number from ${originalNumber} to ${infringement.noticeNumber}`,
                });
                return infringement.noticeNumber;
            }),
        );
        await promax.run();
        return promax.getResultMap();
    }

    async fixInvalidCharacterInfringements() {
        const allInfringements = await Infringement.createQueryBuilder('infringement').getMany();
        const toFix = allInfringements.filter((infringement) => infringement.noticeNumber !== asNoticeNumber(infringement.noticeNumber));

        const promax = Promax.create(Config.get.systemPerformance.defaultConcurrentJobs, {
            throws: false,
        });

        for (const infringement of toFix) {
            promax.add(async () => {
                infringement.noticeNumber = asNoticeNumber(infringement.noticeNumber);
                await infringement.save();
                return infringement;
            });
        }

        await promax.run();

        return {
            results: promax.getResultMap(),
            count: toFix.length,
        };
    }
}

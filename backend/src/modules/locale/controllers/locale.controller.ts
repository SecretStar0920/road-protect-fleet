import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsDefined, IsIn } from 'class-validator';
import { promises as fs } from 'fs';
import { Logger } from '@logger';
import { merge, omit } from 'lodash';
import { UserSocket } from '@modules/shared/decorators/user-socket.decorator';

import { Config } from '@config/config';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { flatten, unflatten } from 'flat';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';

class LanguageFileDto {
    @IsIn(['en', 'he'])
    lang: string;

    @IsDefined()
    ns: string;
}

@Controller('locale')
export class LocaleController {
    // private cache: { [key: string]: any } = {};
    private missingTranslations: { [key: string]: any } = {};
    private writeTrigger: BehaviorSubject<any> = new BehaviorSubject<any>({});

    constructor(private logger: Logger) {
        this.writeTrigger.pipe(debounceTime(2000), distinctUntilChanged()).subscribe((result) => {
            this.writeTranslationFile(result.lang, result.ns);
        });
    }

    @Get(':lang/:ns')
    async getTranslation(@Param() dto: LanguageFileDto) {
        let json = null;
        if (!json) {
            json = await this.getTranslationFile(dto);
            // this.cache[`${dto.lang}/${dto.ns}`] = json;
        }
        return json;
    }

    @Post('add/:lang/:ns')
    async missingTranslation(@Param() dto: LanguageFileDto, @Body() body: any, @UserSocket() socket: DistributedWebsocket) {
        body = omit(body, ['_t']);
        body = unflatten(body, { delimiter: '.' });
        if (Config.get.isProduction() || Config.get.isStaging()) {
            this.logger.error({ message: 'Missing translation', detail: body, fn: this.missingTranslation.name });
            return true;
        }
        this.logger.warn({ message: 'Missing translation', detail: body, fn: this.missingTranslation.name });

        // Store missing translations
        const currentMissingTranslations = this.missingTranslations[`${dto.lang}/${dto.ns}`] || {};
        this.missingTranslations[`${dto.lang}/${dto.ns}`] = merge(currentMissingTranslations, body);

        // console.log(json);

        // Trigger a file write
        this.writeTrigger.next({
            lang: dto.lang,
            ns: dto.ns,
        });
        socket.emit('missing-translations', { count: Object.keys(flatten(this.missingTranslations)).length });
        return true;
    }

    private async writeTranslationFile(lang: string, ns: string) {
        if (!lang || !ns) {
            return;
        }
        const translationFile = await this.getTranslationFile({ lang, ns });
        const newTranslationsFile = merge(translationFile, this.missingTranslations[`${lang}/${ns}`]);
        this.logger.debug({
            message: 'Writing translation file update',
            detail: { lang, ns, translations: this.missingTranslations },
            fn: this.writeTranslationFile.name,
        });
        await fs.writeFile(`/app/locales/${lang}/${ns}.json`, JSON.stringify(newTranslationsFile, null, 4), 'utf8').catch((e) => {
            this.logger.error({
                message: 'Failed to write locale file',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.writeTranslationFile.name,
            });
        });

        // Clear cache if it is written
        this.missingTranslations = {};
        // this.cache[`${lang}/${ns}`] = newTranslationsFile;
    }

    private async getTranslationFile(dto: LanguageFileDto) {
        return JSON.parse(await fs.readFile(`/app/locales/${dto.lang}/${dto.ns}.json`, 'utf8'));
    }
}

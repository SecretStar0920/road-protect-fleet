import got from 'got';
import * as http from 'http';
import * as https from 'https';
import { default as urlToOptions } from 'got/dist/source/core/utils/url-to-options';
import * as FormData from 'form-data';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Check https://forums.meteor.com/t/solved-problems-with-using-the-got-http-package/54297 for why
 * I need to do this.
 */
export const httpClient = got.extend({
    request: (url, options, callback) => {
        if (url.protocol === 'https:') {
            return https.request({ ...options, ...urlToOptions(url) }, callback);
        }

        return http.request({ ...options, ...urlToOptions(url) }, callback);
    },
});

export class FormFileEntryOptions {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    contentType?: string;
}

export class FormFileEntry {
    @Expose()
    value: Buffer;

    @IsOptional()
    @Type(() => FormFileEntryOptions)
    @ValidateNested()
    options?: FormFileEntryOptions;
}

export function jsonToFormData(data: { [key: string]: string | number | null | undefined | FormFileEntry | any }): FormData {
    const form = new FormData();
    const keys = Object.keys(data).filter((key) => data.hasOwnProperty(key));
    for (const key of keys) {
        const value: any = data[key];
        if (value === undefined || value === null) {
            continue;
        }

        if (value instanceof FormFileEntry || Buffer.isBuffer(value?.value)) {
            const options: any = value.options || {};
            const formOptions = {
                filename: options?.name ? options.name : options?.filename ? options.filename : null,
                contentType: options?.contentType ? options.contentType : null,
            };
            form.append(key, value.value as Buffer, formOptions);
        } else {
            // Just a standard input
            form.append(key, value);
        }
    }
    return form;
}

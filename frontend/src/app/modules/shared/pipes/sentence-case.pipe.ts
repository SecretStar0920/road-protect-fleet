import { Pipe, PipeTransform } from '@angular/core';
import { startCase } from 'lodash';

@Pipe({
    name: 'sentenceCase',
})
export class SentenceCasePipe implements PipeTransform {
    transform(value: string | number, ...args: any[]): any {
        return startCase(`${value}`);
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import format from 'xml-formatter';

@Pipe({
    name: 'xml',
})
export class XmlPipe implements PipeTransform {
    transform(value: string, ...args: any[]): any {
        if (value.trim()[0] !== '<') {
            return value;
        }
        return format(value);
    }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, complete: boolean = true, characters: number = 25): any {
        if (value.length < characters) {
            return value;
        }
        if (complete) {
            characters = value.substr(0, characters).lastIndexOf(' ');
        }
        return `${value.substr(0, characters)}...`;
    }
}

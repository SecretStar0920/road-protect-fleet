import * as purdy from 'purdy';

export function pretty(data: any) {
    return purdy.stringify(data, { indent: 2, depth: 10 });
}

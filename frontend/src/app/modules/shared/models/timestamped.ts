import { Transform } from 'class-transformer';
import { Moment } from 'moment';
import { momentTransform } from '@modules/shared/transforms/moment.transform';

export class Entity {}

export class Timestamped extends Entity {

    createdAt: string;
    
    updatedAt: string;
}

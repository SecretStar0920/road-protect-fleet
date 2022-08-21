import { Entity, Index, ManyToMany, PrimaryColumn } from 'typeorm';
import { AccountUser, TimeStamped } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class BlacklistedAction extends TimeStamped {
    @PrimaryColumn('text')
    @Index()
    @ApiProperty()
    action: string;

    @ManyToMany((type) => AccountUser, (accountUser) => accountUser.blacklistedActions)
    @ApiProperty({ description: 'AccountUser[]', type: 'object' })
    accountUsers: AccountUser[];
}

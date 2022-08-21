import { TimeStamped } from '@entities';
import { Column, Entity, Index, PrimaryGeneratedColumn, SelectQueryBuilder } from 'typeorm';
import { EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { EmailContext } from '@modules/shared/modules/email/interfaces/email.interface';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class EmailLog extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    emailLogId: number;

    @Column('enum', { enum: EmailTemplate })
    @ApiProperty({ enum: EmailTemplate })
    template: EmailTemplate;

    @Column('text')
    @ApiProperty()
    to: string;

    @Column('jsonb', { default: {} })
    @ApiProperty()
    cc: string[];

    @Column('jsonb', { default: {} })
    @ApiProperty()
    bcc: string[];

    @Column('bool', { default: true })
    @ApiProperty()
    success: boolean;

    @Column('jsonb', { default: {} })
    @ApiProperty()
    details: any;

    @Column('jsonb', { default: {} })
    @ApiProperty({ type: () => EmailContext })
    context: EmailContext;

    @Column('bool', { default: false })
    @ApiProperty()
    attachments?: boolean;

    static findWithMinimalRelations(): SelectQueryBuilder<EmailLog> {
        return this.createQueryBuilder('emailLog');
    }
}

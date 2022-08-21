import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { RawInfringement, TimeStamped } from '@entities';
import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { ApiProperty } from '@nestjs/swagger';

/**
 * The client entity stores tokens for external parties that need to access the
 * system
 */

export const CLIENT_CONSTRAINTS: IDatabaseConstraints = {
    name: {
        keys: ['name'],
        constraint: 'unique_client_name',
        description: 'An client with this name already exists',
    },
};

@Entity()
@Unique(CLIENT_CONSTRAINTS.name.constraint, CLIENT_CONSTRAINTS.name.keys)
export class Client extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    clientId: number;

    @Column('text')
    @ApiProperty()
    name: string;

    @Column('text', { unique: true, nullable: true, select: false })
    @ApiProperty()
    token: string;

    @Column('int', { default: 0 })
    @ApiProperty()
    usageCount: number;

    @OneToMany((type) => RawInfringement, (infringement) => infringement.client)
    @ApiProperty({ description: 'RawInfringement[]', type: 'object' })
    rawInfringements: RawInfringement[];

    static async incrementUsage(clientId: number): Promise<void> {
        await this.createQueryBuilder()
            .update(Client)
            .set({
                usageCount: () => `"usageCount" + 1`,
            })
            .where('client."clientId" = :clientId', { clientId })
            .execute();
    }

    static async findByName(name: string) {
        return this.createQueryBuilder('client').where('client.name = :name', { name }).getOne();
    }

    static async findOrCreateByName(name: string) {
        const found = await this.findByName(name);
        if (!found) {
            return await Client.create({
                name,
            }).save();
        }
        return found;
    }
}

import {
    Account,
    AccountRelation,
    AccountRole,
    Client,
    ContractStatus,
    Document,
    Infringement,
    Issuer,
    LeaseContract,
    Nomination,
    NominationType,
    OwnershipContract,
    PhysicalLocation,
    Role,
    User,
    UserType,
    Vehicle,
} from '@entities';
import * as faker from 'faker';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import * as moment from 'moment';
import { Config } from '@config/config';

class Generator {
    @Transactional()
    async vehicle(details: Partial<Vehicle> = {}): Promise<Vehicle> {
        return Vehicle.create({
            registration: faker.random.alphaNumeric(8),
            manufacturer: faker.commerce.productName(),
            ...details,
        }).save();
    }

    @Transactional()
    async account(details: Partial<Account> = {}): Promise<Account> {
        const streetName: string = faker.address.streetName();
        const streetNumber: string = faker.random.number(1000).toString();
        return Account.create({
            name: faker.company.companyName(),
            identifier: faker.random.alphaNumeric(6),
            ...details,
            physicalLocation: {
                rawAddress: `${streetName} ${streetNumber}`,
                streetNumber,
                streetName,
                city: faker.address.city(),
                country: faker.address.country(),
                code: faker.random.number(9999).toString(),
            },
        }).save();
    }
    @Transactional()
    async user(details: Partial<User> = {}): Promise<User> {
        return User.create({
            name: faker.name.firstName(),
            surname: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.random.alphaNumeric(8),
            type: UserType.Standard,
            ...details,
        }).save();
    }

    @Transactional()
    async document(details: Partial<Document> = {}): Promise<Document> {
        return Document.create({
            storageName: faker.random.alphaNumeric(10),
            fileName: faker.system.fileName(),
            fileDirectory: faker.system.filePath(),
            ...details,
        }).save();
    }

    @Transactional()
    async accountRelation(details: Partial<AccountRelation> = {}): Promise<AccountRelation> {
        const forward = details.forward || (await this.account());
        const reverse = details.reverse || (await this.account());
        const data = details.data || { summary: faker.lorem.sentence() };
        return AccountRelation.create({
            forward,
            reverse,
            data,
            ...details,
        }).save();
    }

    @Transactional()
    async leaseContract(details: Partial<LeaseContract> = {}): Promise<LeaseContract> {
        const startDate = details.startDate || moment().subtract(7, 'days').toISOString();
        const endDate = details.endDate || moment().add(7, 'days').toISOString();
        const user = details.user || (await this.account({ role: AccountRole.User }));
        const owner = details.owner || (await this.account({ role: AccountRole.Owner }));
        const vehicle = details.vehicle || (await this.vehicle());

        return LeaseContract.create({
            startDate: moment(startDate).toISOString(),
            endDate: moment(endDate).toISOString(),
            vehicle,
            user,
            owner,
            status: ContractStatus.Valid,
            ...details,
        }).save();
    }

    @Transactional()
    async ownershipContract(details: Partial<OwnershipContract> = {}): Promise<OwnershipContract> {
        const startDate = details.startDate || moment().subtract(7, 'days').toISOString();
        const endDate = details.endDate || moment().add(7, 'days').toISOString();
        const owner = details.owner || (await this.account({ role: AccountRole.Owner }));
        const vehicle = details.vehicle || (await this.vehicle());

        return OwnershipContract.create({
            startDate: moment(startDate).toISOString(),
            endDate: moment(endDate).toISOString(),
            vehicle,
            owner,
            status: ContractStatus.Valid,
            ...details,
        }).save();
    }

    @Transactional()
    async issuer(details: Partial<Issuer> = {}): Promise<Issuer> {
        return Issuer.create({
            name: faker.company.companyName(),
            code: faker.random.alphaNumeric(4),
            ...details,
        }).save();
    }

    @Transactional()
    async nomination(details: Partial<Nomination> = {}): Promise<Nomination> {
        return Nomination.create({
            type: NominationType.Digital,
            ...details,
        }).save();
    }

    @Transactional()
    async role(details: Partial<Role> = {}): Promise<Role> {
        return Role.create({
            name: faker.random.word(),
            ...details,
        }).save();
    }

    @Transactional()
    async client(details: Partial<Client> = {}): Promise<Client> {
        return Client.create({
            name: faker.random.word(),
            ...details,
        }).save();
    }

    @Transactional()
    async physicalLocation(details: Partial<PhysicalLocation> = {}): Promise<PhysicalLocation> {
        return PhysicalLocation.create({
            streetName: faker.address.streetName(),
            streetNumber: `${faker.random.number(400)}`,
            country: 'South Africa',
            ...details,
        }).save();
    }

    @Transactional()
    async infringement(details: Partial<Infringement> = {}): Promise<Infringement> {
        const issuer = details.issuer || (await this.issuer());
        const location = details.location || (await this.physicalLocation());
        const vehicle = details.vehicle || (await this.vehicle());
        return Infringement.create({
            noticeNumber: faker.random.alphaNumeric(10),
            amountDue: `${faker.random.number(1000)}`,
            originalAmount: `${faker.random.number(1000)}`,
            offenceDate: details.offenceDate || moment().toISOString(),
            latestPaymentDate: details.latestPaymentDate || moment().add(Config.get.infringement.defaultPaymentDays, 'days').toISOString(),
            issuer,
            location,
            vehicle,
            ...details,
        }).save();
    }
}

export const fakeSocket: any = {
    emit: (...args) => {},
};

export const generator = new Generator();

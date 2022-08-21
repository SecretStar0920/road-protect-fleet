import { BaseEntity } from 'typeorm';
import {
    Account,
    AccountUser,
    AccountUserRole,
    Document,
    Infringement,
    IntegrationPayment,
    Issuer,
    LeaseContract,
    ManualPayment,
    Nomination,
    OwnershipContract,
    Permission,
    PhysicalLocation,
    Role,
    RolePermission,
    User,
    Vehicle,
    VehicleDocument,
} from '@entities';

export const spreadsheetEntities: { [name: string]: typeof BaseEntity } = {
    User,
    Account,
    AccountUser,
    AccountUserRole,
    Permission,
    Role,
    RolePermission,
    Document,
    LeaseContract,
    OwnershipContract,
    VehicleDocument,
    Vehicle,
    Infringement,
    ManualPayment,
    IntegrationPayment,
    Issuer,
    Nomination,
    PhysicalLocation,
};

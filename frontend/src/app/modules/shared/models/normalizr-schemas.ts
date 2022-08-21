import { schema } from 'normalizr';

// Schemas
export const account = new schema.Entity('account', {}, { idAttribute: 'accountId' }); //
export const accountRelation = new schema.Entity('accountRelation', {}, { idAttribute: 'accountRelationId' });
export const accountRelationDocument = new schema.Entity('accountRelationDocument', {}, { idAttribute: 'accountRelationDocumentId' });
export const accountUser = new schema.Entity('accountUser', {}, { idAttribute: 'accountUserId' }); //
export const accountUserRole = new schema.Entity('accountUserRole', {}, { idAttribute: 'accountUserRoleId' }); //
export const auditLog = new schema.Entity('auditLog', {}, { idAttribute: 'auditLogId' });
export const client = new schema.Entity('client', {}, { idAttribute: 'clientId' }); //
export const contract = new schema.Entity('contract', {}, { idAttribute: 'contractId' }); //
export const creditGuardToken = new schema.Entity('creditGuardToken', {}, { idAttribute: 'creditGuardTokenId' });
export const document = new schema.Entity('document', {}, { idAttribute: 'documentId' }); //
export const documentTemplate = new schema.Entity('documentTemplate', {}, { idAttribute: 'documentTemplateId' });
export const featureFlag = new schema.Entity('featureFlag', {}, { idAttribute: 'featureFlagId' });
export const generatedDocument = new schema.Entity('generatedDocument', {}, { idAttribute: 'generatedDocumentId' });
export const infringement = new schema.Entity('infringement', {}, { idAttribute: 'infringementId' }); //
export const infringementLog = new schema.Entity('infringementLog', {}, { idAttribute: 'infringementLogId' });
export const infringementNote = new schema.Entity('infringementNote', {}, { idAttribute: 'infringementNoteId' });
export const integrationPayment = new schema.Entity('integrationPayment', {}, { idAttribute: 'integrationPaymentId' });
export const issuer = new schema.Entity('issuer', {}, { idAttribute: 'issuerId' }); //
export const lease = new schema.Entity('lease', {}, { idAttribute: 'contractId' });
export const ownership = new schema.Entity('ownership', {}, { idAttribute: 'contractId' });
export const location = new schema.Entity('location', {}, { idAttribute: 'locationId' }); //
export const log = new schema.Entity('log', {}, { idAttribute: 'logId' }); //
export const nomination = new schema.Entity('nomination', {}, { idAttribute: 'nominationId' }); //
export const payment = new schema.Entity('payment', {}, { idAttribute: 'paymentId' }); //
export const permission = new schema.Entity('permission', {}, { idAttribute: 'permissionId' }); //
export const rawInfringement = new schema.Entity('rawInfringement', {}, { idAttribute: 'rawInfringementId' }); //
export const requestCache = new schema.Entity('requestCache', {}, { idAttribute: 'requestCacheId' });
export const role = new schema.Entity('role', {}, { idAttribute: 'roleId' }); //
export const rolePermission = new schema.Entity('rolePermission', {}, { idAttribute: 'rolePermissionId' }); //
export const street = new schema.Entity('street', {}, { idAttribute: 'streetId' });
export const timestamped = new schema.Entity('timestamped', {}, { idAttribute: 'timestampedId' }); //
export const user = new schema.Entity('user', {}, { idAttribute: 'userId' }); //
export const vehicleDocument = new schema.Entity('vehicleDocument', {}, { idAttribute: 'vehicleDocumentId' }); //
export const vehicle = new schema.Entity('vehicle', {}, { idAttribute: 'vehicleId' }); //

// Definitions
account.define({
    location,
    powerOfAttorney: document,
    users: [accountUser],
    asUser: lease,
    asOwner: ownership,
    nominations: [nomination],
    logs: [log],
    forwardRelations: [accountRelation],
    reverseRelations: [accountRelation],
});

accountRelation.define({
    forward: account,
    reverse: account,
});

accountUser.define({
    user,
    account,
    roles: [accountUserRole],
});

accountUserRole.define({
    accountUser,
    role,
});

role.define({
    accountUsers: [accountUser],
    permissions: [rolePermission],
});

rolePermission.define({
    role,
    permission,
});

permission.define({
    roles: [rolePermission],
});

user.define({
    accounts: [accountUser],
    logs: [log],
});

client.define({
    rawInfringements: [rawInfringement],
});

// TODO: inheritance
contract.define({
    document,
    vehicle,
    infringements: [infringement],
});

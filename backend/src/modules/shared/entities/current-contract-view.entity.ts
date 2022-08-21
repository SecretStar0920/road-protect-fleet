// @ViewEntity({
//     expression: (connection: Connection) => connection.createQueryBuilder()
//         .select('contract.contractId', 'contractId')
//         .addSelect('contract.endDate', 'endDate')
//         .addSelect('contract.startDate', 'startDate')
//         .addSelect('CURRENT_TIMESTAMP between contract.startDate and contract.endDate', 'current')
//         .from(Contract, 'contract')
// })
// export class CurrentContractViewEntity {
//     @ViewColumn()
//     contractId: string;
//
//     @ViewColumn()
//     current: boolean;
//
//     @ViewColumn()
//     startDate: string;
//
//     @ViewColumn()
//     endDate: string;
// }

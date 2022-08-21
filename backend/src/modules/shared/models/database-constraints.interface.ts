export interface IDatabaseConstraints {
    [key: string]: IKeyConstraint & IExpressionConstraint;
}

export interface IBaseDatabaseConstraint {
    description: string;
    constraint: string;
}

export interface IKeyConstraint extends IBaseDatabaseConstraint {
    keys?: string[];
}

export interface IExpressionConstraint extends IBaseDatabaseConstraint {
    expression?: string;
}

import { schema } from 'normalizr';
import { Connection } from 'typeorm';
import { camelCase, Dictionary, forEach, isArray } from 'lodash';
import { Logger } from '@logger';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface ISerializedSchemas {
    entities: string[];
    schemaObjects: Dictionary<Dictionary<string | string[]>>;
}

export class NormalizrSchemaHelper {
    public static entitySchemas: Dictionary<schema.Entity>;
    public static serializableSchemas: Dictionary<Dictionary<string | string[]>> = {};
    protected static schemaDirectory = path.join('.', 'relation-schemas.json');

    public static async serializeSchema(connection: Connection) {
        const entityMetadatas = connection.entityMetadatas;

        // Then map relations for each schema based on Entity Relations
        for (const metadata of entityMetadatas) {
            const name = camelCase(metadata.name);
            const relations = metadata.relations;
            this.serializableSchemas[name] = {};
            for (const relation of relations) {
                const relationName = camelCase(relation.inverseEntityMetadata.name);
                if (relation.relationType === 'one-to-one') {
                    this.serializableSchemas[name][relation.propertyName] = relationName;
                } else if (relation.relationType === 'one-to-many') {
                    this.serializableSchemas[name][relation.propertyName] = [relationName];
                } else if (relation.relationType === 'many-to-one') {
                    this.serializableSchemas[name][relation.propertyName] = relationName;
                } else if (relation.relationType === 'many-to-many') {
                    this.serializableSchemas[name][relation.propertyName] = [relationName];
                }
            }
        }

        const saveObject: ISerializedSchemas = {
            entities: Object.keys(this.serializableSchemas),
            schemaObjects: this.serializableSchemas,
        };

        await fs.writeJSON(this.schemaDirectory, saveObject, { spaces: 4 });
        Logger.instance.debug({ message: 'Generated relation schemas JSON', fn: this.serializeSchema.name });
    }

    public static async deserializeSchema() {
        const serializedObject: ISerializedSchemas = await fs.readJSON(this.schemaDirectory);
        const { entities, schemaObjects } = serializedObject;
        const schemas: Dictionary<schema.Entity> = {};

        forEach(entities, (name) => {
            schemas[name] = new schema.Entity<any>(name, {}, { idAttribute: name + 'Id' });
        });

        forEach(schemaObjects, (relations, schemaName) => {
            const name = schemaName;
            const defineObject = {};
            forEach(relations, (relation, relationName) => {
                if (isArray(relation)) {
                    defineObject[relationName] = relation.map((val) => schemas[val]);
                } else {
                    defineObject[relationName] = schemas[relation];
                }
            });
            schemas[name].define(defineObject);
        });
        this.entitySchemas = schemas;
    }

    public static async generateSchemaFromTypeOrmMetadata(connection: Connection) {
        Logger.instance.debug({ message: 'Initializing normalizr schemas', fn: this.generateSchemaFromTypeOrmMetadata.name });
        const entityMetadatas = connection.entityMetadatas;
        const schemas: Dictionary<schema.Entity> = {};

        // First create base schema
        for (const metadata of entityMetadatas) {
            const name = camelCase(metadata.name);
            schemas[name] = new schema.Entity<any>(name, {}, { idAttribute: name + 'Id' });
        }

        Logger.instance.debug({
            message: 'Added normalizr entities',
            detail: { entities: Object.keys(schemas).length },
            fn: this.generateSchemaFromTypeOrmMetadata.name,
        });

        // Then map relations for each schema based on Entity Relations
        for (const metadata of entityMetadatas) {
            const name = camelCase(metadata.name);
            const relations = metadata.relations;
            const defineObject = {};
            for (const relation of relations) {
                const relationName = camelCase(relation.inverseEntityMetadata.name);

                if (relation.relationType === 'one-to-one') {
                    defineObject[relation.propertyName] = schemas[relationName];
                } else if (relation.relationType === 'one-to-many') {
                    defineObject[relation.propertyName] = [schemas[relationName]];
                } else if (relation.relationType === 'many-to-one') {
                    defineObject[relation.propertyName] = schemas[relationName];
                } else if (relation.relationType === 'many-to-many') {
                    defineObject[relation.propertyName] = [schemas[relationName]];
                }
            }

            schemas[name].define(defineObject);
        }
        Logger.instance.debug({ message: 'Defined relations', fn: this.generateSchemaFromTypeOrmMetadata.name });
        this.entitySchemas = schemas;
    }
}

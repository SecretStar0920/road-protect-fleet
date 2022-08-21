export class Typeorm {
    static base(command: string) {
        return `npm run script-runner -- ./node_modules/typeorm/cli.js -f ./dist/modules/shared/modules/database/database.config.js ${command}`;
    }

    static generateMigrations(name: string) {
        return this.base(`migration:generate -n ${name}`);
    }

    static runMigrations() {
        return this.base(`migration:run`);
    }

    static sync() {}
}

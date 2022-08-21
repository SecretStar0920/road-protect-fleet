import * as fs from 'fs-extra';

export class DockerCompose {
    constructor(public type: string, public projectOverride: string = '') {}

    private baseDockerCompose() {
        const projectName = `rp-${this.projectOverride ? this.projectOverride : this.type}`;
        return `docker-compose -f docker-compose.${this.type}.yaml -p ${projectName}`;
    }

    async composeFileExists(path: string) {
        const exists = fs.pathExists(`${path}/docker-compose.${this.type}.yaml`);
        if (!exists) {
            throw new Error('Docker compose file does not exist');
        }
    }

    up(watch: boolean, build = true) {
        let command = `${this.baseDockerCompose()} up ${build ? '--build' : ''}`;
        if (!watch) {
            command += ' -d';
        }
        return command;
    }

    down() {
        return `${this.baseDockerCompose()} down`;
    }

    logs(tail: number, service?: string) {
        if (service) {
            return `${this.baseDockerCompose()} logs -f --tail=${tail} ${service}`;
        }

        return `${this.baseDockerCompose()} logs -f --tail=${tail}`;
    }

    restart(service?: string) {
        if (service) {
            return `${this.baseDockerCompose()} restart ${service}`;
        }

        return `${this.baseDockerCompose()} restart`;
    }

    getServices() {
        return `${this.baseDockerCompose()} ps --services`;
    }

    execTty(service: string, command: string) {
        return `${this.baseDockerCompose()} exec ${service} ${command}`;
    }

    exec(service: string, command: string) {
        return `${this.baseDockerCompose()} exec -T ${service} ${command}`;
    }
}

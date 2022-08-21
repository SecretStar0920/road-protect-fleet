import { exec, ExecException, spawn } from 'child_process';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';
import * as chalk from 'chalk';

export class ExecuteError extends Error {
    constructor(message: string, public error: ExecException) {
        super();
    }
}

export async function executeCommand(command: string, dir?: string): Promise<{ error: string; out: string }> {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: dir, shell: '/bin/bash' }, (error, stdout, stderr) => {
            if (!isNil(error)) {
                return reject(new ExecuteError('Command failed', error));
            }

            return resolve({ error: stderr, out: stdout });
        });
    });
}

export function spawnCommand(command: string, dir?: string): Observable<{ error?: string; out?: string }> {
    const streamCommand = spawn(command, { cwd: dir, shell: '/bin/bash' });
    process.on('SIGINT', () => {
        console.log(chalk.default.yellow('Cancelling command via SIGINT Interrupt'));
        streamCommand.kill('SIGINT');
    });
    streamCommand.stdout.pipe(process.stdout);
    streamCommand.stderr.pipe(process.stderr);
    return new Observable<{ error?: string; out?: string }>((subscriber) => {
        streamCommand.on('error', (error) => subscriber.error(error));
        streamCommand.on('close', (close) => subscriber.complete());
        streamCommand.on('exit', (code, signal) => {
            if (signal) {
                console.log(chalk.default.yellow('SIGNAL EXIT:'), signal);
                subscriber.complete();
            } else if (code) {
                if (code !== 0) {
                    subscriber.error(`Non-zero exit code: ${code}`);
                } else {
                    subscriber.complete();
                }
            }
        });
        streamCommand.stdout.on('data', (data) => {
            const out = stringifyData(data);
            if (out.length) {
                subscriber.next({ out: out });
            }
        });
        streamCommand.stderr.on('data', (data) => {
            const error = stringifyData(data);
            if (error.length) {
                subscriber.next({ error: error });
            }
        });
    });
}

export async function spawnInteractiveCommand(command: string, dir?: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const streamCommand = spawn(command, { cwd: dir, shell: '/bin/bash', stdio: 'inherit' });
        streamCommand.on('exit', (exit) => {
            resolve(exit);
        });
    });
}

function stringifyData(data: any) {
    return data.toString().trim();
}

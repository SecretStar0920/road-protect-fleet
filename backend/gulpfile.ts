import * as gulp from 'gulp';
import * as path from 'path';
import { spawn } from 'child_process';
import * as fs from 'fs-extra';

export class CustomTestConfig {
    pattern: string = '*';
}

export const testConfigPath = path.join(__dirname, 'test', 'custom-test-config.json');

gulp.task('test', async () => {
    // Resolve custom test config before running the test
    if (!(await fs.pathExists(testConfigPath))) {
        await fs.writeJSON(testConfigPath, new CustomTestConfig());
    }
    const customTestConfig: CustomTestConfig = await fs.readJSON(testConfigPath);

    return new Promise((res, rej) => {
        const command = spawn(
            `npm run kill:debug-port && node --inspect=0.0.0.0:9229 ./node_modules/jest/bin/jest.js ${customTestConfig.pattern} --runInBand --verbose --forceExit --colors`,
            {
                cwd: __dirname,
                shell: '/bin/bash',
                stdio: 'inherit',
            },
        );

        command.on('exit', (exit) => {
            res(exit);
        });
    });
});

gulp.task('watch-test-files', () => {
    gulp.watch(
        [
            path.join(__dirname, 'src', '/**/*.+(ts|js|json)'),
            path.join(__dirname, 'test', '/**/*.+(ts|js|json)'),
            path.join(__dirname, 'package.json'),
        ],
        { delay: 200, queue: false },
        gulp.series(['test']),
    );
});

gulp.task('test:watch', (done) => {
    gulp.series([gulp.task('test'), gulp.task('watch-test-files')])(done);
});

import { Logger, LoggerClass, LoggerMethod } from '@logger';

@LoggerClass()
class LogTestClass {
    private logger = Logger.instance;

    @LoggerMethod()
    async asyncFunction(someData: any): Promise<any> {
        this.logger.logV2({ message: 'Log inside async function', context: this });
        return someData;
    }

    @LoggerMethod({ async: false })
    syncFunction(someData: any): any {
        this.logger.logV2({ message: 'Log inside sync function', context: this });
        return someData;
    }

    @LoggerMethod()
    async asyncErrorFunction(someData: any): Promise<any> {
        this.logger.logV2({ message: 'Log inside async function', context: this });
        throw new Error('Async error');
    }

    @LoggerMethod({ async: false })
    syncErrorFunction(someData: any): any {
        this.logger.logV2({ message: 'Log inside sync function', context: this });
        throw new Error('Sync error');
    }
}

describe.only('Logging Service', () => {
    const testClass = new LogTestClass();

    beforeAll(async () => {});

    describe('Decorators', () => {
        it('Should work for synchronous functions', () => {
            const data = { value: 1 };
            const result = testClass.syncFunction(data);
            expect(result).toEqual(data);
        });
        it('Should work for asynchronous functions', async () => {
            const data = { value: 1 };
            const result = await testClass.asyncFunction(data);
            expect(result).toEqual(data);
        });
        it('Should catch errors for synchronous functions', () => {
            const data = { value: 1 };
            try {
                const result = testClass.syncErrorFunction(data);
            } catch (e) {
                expect(e.message).toEqual('Sync error');
            }
        });
        it('Should catch errors for asynchronous functions', async () => {
            const data = { value: 1 };
            try {
                const result = await testClass.asyncErrorFunction(data);
            } catch (e) {
                expect(e.message).toEqual('Async error');
            }
        });
    });
});

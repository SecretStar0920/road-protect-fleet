import { Global, Module } from '@nestjs/common';
import { Logger } from './services/logger.service';
import { DirectoryService } from './services/directory.service';
import { FileService } from './services/file.service';

@Global()
@Module({
    providers: [
        {
            provide: Logger,
            useValue: Logger.instance,
        },
        DirectoryService,
        FileService,
    ],
    exports: [
        {
            provide: Logger,
            useValue: Logger.instance,
        },
        DirectoryService,
        FileService,
    ],
})
export class SharedModule {}

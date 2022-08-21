import { Module } from '@nestjs/common';
import { AutocompleteController } from './controllers/autocomplete.controller';

@Module({
    controllers: [AutocompleteController],
})
export class AutocompleteModule {}

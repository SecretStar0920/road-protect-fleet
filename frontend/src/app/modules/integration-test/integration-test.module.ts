import { NgModule } from '@angular/core';
import { IntegrationTestPageComponent } from '@modules/integration-test/components/integration-testing-page/integration-test-page.component';
import { SharedModule } from '@modules/shared/shared.module';
import { IntegrationTestComponent } from './components/integration-test/integration-test.component';

@NgModule({
    declarations: [IntegrationTestPageComponent, IntegrationTestComponent],
    imports: [SharedModule],
    exports: [IntegrationTestPageComponent],
})
export class IntegrationTestModule {}

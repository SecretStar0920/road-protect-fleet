import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './components/landing/landing.component';
import { AuthModule } from '@modules/auth/auth.module';
import { MinimalSharedModule } from '@modules/minimal-shared/minimal-shared.module';

@NgModule({
    declarations: [LandingComponent],
    imports: [CommonModule, MinimalSharedModule, AuthModule, LandingRoutingModule],
})
export class LandingModule {}

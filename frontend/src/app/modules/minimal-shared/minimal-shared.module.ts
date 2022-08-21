import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { I18NextModule } from 'angular-i18next';
import { NgZorroModule } from '@modules/ng-zorro-module/ng-zorro.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, NgZorroModule, HttpClientModule, I18NextModule],
    exports: [NgZorroModule, FormsModule, RouterModule, ReactiveFormsModule, HttpClientModule, I18NextModule],
})
export class MinimalSharedModule {}

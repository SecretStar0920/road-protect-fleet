import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import he from '@angular/common/locales/he';
import { StoreModule } from '@ngrx/store';
import { JwtModule } from '@auth0/angular-jwt';
import { LoggerModule } from 'ngx-logger';
import { environment } from '@environment/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer } from '@modules/shared/services/custom-ngrx-router-serializer/custom-ngrx-router-serializer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorInterceptor } from '@modules/shared/services/http/http-error-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalErrorModule } from '@modules/shared/modules/global-error/global-error.module';
import { HttpLoadingInterceptor } from '@modules/shared/services/http/http-loading-interceptor.service';
import { GlobalLoadingModule } from '@modules/shared/modules/global-loading/global-loading.module';
import { metaReducers, reducers } from './ngrx/app.reducer';
import { BrowserModule, Title } from '@angular/platform-browser';
import { MinimalSharedModule } from '@modules/minimal-shared/minimal-shared.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { RealtimeModule } from '@modules/shared/modules/realtime/realtime.module';
import { defaultInterpolationFormat, I18NEXT_SERVICE, I18NextModule, I18NextTitle, ITranslationService } from 'angular-i18next';
import HttpApi from 'i18next-http-backend';
import i18nextLanguageDetector from 'i18next-browser-languagedetector';
import { HttpSocketIdInterceptor } from '@modules/shared/services/http/http-socket-id-interceptor.service';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { BidiModule } from '@angular/cdk/bidi';


registerLocaleData(en);
registerLocaleData(he);

export function tokenGetter() {
    return localStorage.getItem('idToken');
}

export function socketIdGetter() {
    return sessionStorage.getItem('io');
}

const config: SocketIoConfig = { url: '', options: { autoConnect: false } };

export function appInit(i18next: ITranslationService) {
    return () =>
        i18next
            .use(HttpApi)
            .use(i18nextLanguageDetector)
            .init({
                whitelist: ['en', 'he'],
                fallbackLng: 'en',
                debug: !environment.production,
                initImmediate: true,
                returnEmptyString: false,
                ns: ['translation', 'validation'],
                interpolation: {
                    format: I18NextModule.interpolationFormat(defaultInterpolationFormat),
                },
                saveMissing: true,
                backend: {
                    loadPath: 'api/v1/locale/{{lng}}/{{ns}}',
                    addPath: 'api/v1/locale/add/{{lng}}/{{ns}}',
                    parsePayload: (ns, key, val) => {
                        const toReturn = {};
                        toReturn[key] = '';
                        return toReturn;
                    },
                    // FIXME: this doesn't work because of timing, might be a way to update it later
                    customHeaders: {
                        Authorization: `Bearer ${tokenGetter()}`,
                        io: socketIdGetter(),
                    },
                },
                detection: {
                    order: ['querystring', 'cookie', 'navigator'],
                    lookupCookie: 'lang',
                    lookupQuerystring: 'lng',
                    caches: ['localStorage', 'cookie'],
                    cookieMinutes: 10080,
                },
            });
}

export function localeIdFactory(i18next: ITranslationService) {
    // TODO: this is return null at start which means datepicker is erroring in time selection
    return i18next.language || 'en';
}

export const I18N_PROVIDERS = [
    {
        provide: APP_INITIALIZER,
        useFactory: appInit,
        deps: [I18NEXT_SERVICE],
        multi: true,
    },
    {
        provide: Title,
        useClass: I18NextTitle,
    },
    {
        provide: LOCALE_ID,
        deps: [I18NEXT_SERVICE],
        useFactory: localeIdFactory,
    },
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        BidiModule,
        // NGRX
        StoreModule.forRoot(reducers, { metaReducers, runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true } }),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
        EffectsModule.forRoot([]),
        // EntityDataModule,
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router',
            serializer: CustomSerializer,
            navigationActionTiming: NavigationActionTiming.PostActivation,
        }),
        JwtModule.forRoot({
            config: { tokenGetter },
        }),
        LoggerModule.forRoot({
            level: environment.loggingLevel,
        }),


        SocketIoModule.forRoot(config),
        I18NextModule.forRoot(),
        MinimalSharedModule,
        GlobalLoadingModule,
        GlobalErrorModule,
        RealtimeModule,
        AppRoutingModule,

    ],
    providers: [
        { provide: NZ_I18N, useValue: en_US },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpLoadingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpSocketIdInterceptor, multi: true },
        I18N_PROVIDERS,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

import { Component, Inject } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { NGXLogger } from 'ngx-logger';
import i18next from 'i18next';
import { DOCUMENT } from '@angular/common';
import { Directionality, Direction } from '@angular/cdk/bidi';

@Component({
    selector: 'rp-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    public dir: Direction = 'ltr';

    constructor(private http: HttpService, private logger: NGXLogger, @Inject(DOCUMENT) private document) {
        this.dir = i18next.dir(i18next.language);
        this.document.dir = this.dir;
        this.http.getSecure('health').subscribe(
            (result) => {
                this.logger.debug('Healthy backend');
            },
            (error) => {
                this.logger.fatal('Backend unhealthy');
            },
        );
    }
}

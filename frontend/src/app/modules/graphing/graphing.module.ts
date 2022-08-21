import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@modules/shared/shared.module';
import { GraphingByStatusPageComponent } from '@modules/graphing/components/graphing-by-status-page/graphing-by-status-page.component';
import { GraphingByStatusTableComponent } from './components/graphing-by-status-page/components/graphing-by-status-table/graphing-by-status-table.component';
import { GraphingByStatusLineGraphComponent } from './components/graphing-by-status-page/components/graphing-by-status-line-graph/graphing-by-status-line-graph.component';
import { GraphingByStatusStackedBarChartComponent } from './components/graphing-by-status-page/components/graphing-by-status-stacked-bar-chart/graphing-by-status-stacked-bar-chart.component';
import { StoreModule } from '@ngrx/store';
import * as fromGraphing from '@modules/graphing/ngrx/graphing.reducer';
import { EffectsModule } from '@ngrx/effects';
import { GraphingEffects } from '@modules/graphing/ngrx/graphing.effects';
import { GraphingByIssuerPageComponent } from './components/graphing-by-issuer-page/graphing-by-issuer-page.component';
import { GraphingByIssuerBarGraphComponent } from './components/graphing-by-issuer-page/components/graphing-by-issuer-bar-graph/graphing-by-issuer-bar-graph.component';
import { GraphingByIssuerLineGraphComponent } from './components/graphing-by-issuer-page/components/graphing-by-issuer-line-graph/graphing-by-issuer-line-graph.component';
import { GraphingByIssuerTableComponent } from './components/graphing-by-issuer-page/components/graphing-by-issuer-table/graphing-by-issuer-table.component';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { GraphingByVehiclePageComponent } from './components/graphing-by-vehicle-page/graphing-by-vehicle-page.component';
import { GraphingByVehicleBarChartComponent } from './components/graphing-by-vehicle-page/components/graphing-by-vehicle-bar-chart/graphing-by-vehicle-bar-chart.component';
import { GraphingByVehicleTableComponent } from '@modules/graphing/components/graphing-by-vehicle-page/components/graphing-by-vehicle-table/graphing-by-vehicle-table.component';
import { GeneralGraphingByTableComponent } from '@modules/graphing/components/general-graphing-by-table/general-graphing-by-table.component';
import { GraphingByTableCellTemplateComponent } from '@modules/graphing/components/general-graphing-by-table-cell-template/graphing-by-table-cell-template.component';
import { GeneralGraphingByPageComponent } from '@modules/graphing/components/general-graphing-by-page/general-graphing-by-page.component';
import { AccountReportingPageComponent } from '@modules/graphing/account-reporting-page/account-reporting-page.component';
import { GraphingByStatusPieChartComponent } from '@modules/graphing/components/graphing-by-status-page/components/graphing-by-status-pie-chart/graphing-by-status-pie-chart.component';
import { GeneralGraphingByInfringementTableComponent } from '@modules/graphing/components/general-graphing-by-infringements-table/general-graphing-by-infringement-table.component';

@NgModule({
    declarations: [
        AccountReportingPageComponent,
        GraphingByStatusPieChartComponent,
        GeneralGraphingByInfringementTableComponent,
        GraphingByStatusPageComponent,
        GraphingByStatusTableComponent,
        GeneralGraphingByPageComponent,
        GraphingByStatusLineGraphComponent,
        GraphingByStatusStackedBarChartComponent,
        GraphingByIssuerPageComponent,
        GeneralGraphingByTableComponent,
        GraphingByIssuerBarGraphComponent,
        GraphingByIssuerLineGraphComponent,
        GraphingByIssuerTableComponent,
        GraphingByVehicleTableComponent,
        GraphingByTableCellTemplateComponent,
        GraphingByVehiclePageComponent,
        GraphingByVehicleBarChartComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('graphing', fromGraphing.reducer),
        EffectsModule.forFeature([GraphingEffects]),
        InfringementModule,
    ],
    exports: [GraphingByStatusPageComponent],
    entryComponents: [GraphingByStatusPageComponent],
})
export class GraphingModule {}

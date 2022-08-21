import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxDataPoint, NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';
import { colors } from '@modules/shared/constants/colors';
import i18next from 'i18next';
import { ElementStateModel } from '@modules/shared/models/element-state.model';

export enum GraphingTypes {
    AdvancedPieChart = 'Advanced Pie Chart',
    PieChart = 'Pie Chart',
    PieChartGrid = 'Pie Chart Grid',
    HorizontalBarGraph = 'Horizontal Bar Graph',
    NumberCards = 'Number Cards',
    GroupedVerticalBarGraph = 'Grouped Vertical Bar Graph',
}

@Component({
    selector: 'rp-graphing',
    templateUrl: './general-graphing.component.html',
    styleUrls: ['./general-graphing.component.less'],
})
export class GeneralGraphingComponent implements OnInit, OnDestroy, OnChanges {
    @Input() showXAxis: boolean = true;
    @Input() showLegend: boolean = true;
    @Input() graphingType: GraphingTypes;
    @Input() dataPoints: NgxDataPoint[];
    @Input() dataSeries: NgxSeriesData[];
    @Input() translateXAxis: boolean = true;
    @Input() translateYAxis: boolean = false;
    @Input() translateLabels: boolean = true;
    @Input() showDataLabel: boolean = false;
    @Input() legendTitle: string = i18next.t('general-graphing.legend');
    @Input() view: [number, number];
    @Input() barPadding: number = 8;
    @Input() groupPadding: number = 16;
    @ViewChild('graphTooltips', { static: true }) graphTooltips: TemplateRef<any>;
    @Input() customTooltipTemplate: TemplateRef<any>;
    @Output() select: EventEmitter<ElementStateModel<any>> = new EventEmitter();
    @Input() colors = { domain: colors.graphPrimary };
    private destroy$ = new Subject();
    graphingTypes = GraphingTypes;

    // options for bar graph
    showYAxis: boolean = true;
    gradient: boolean = false;
    animations: boolean = true;
    showGridLines: boolean = false;
    isDoughnut: boolean = true;
    legendPosition: string = 'below';
    arcWidth: number = 0.4;
    showLabels: boolean = true;
    trimLabels: boolean = false;

    constructor() {}

    async ngOnInit() {
        if (!this.customTooltipTemplate) {
            this.customTooltipTemplate = this.graphTooltips;
        }
    }

    translateAxis(key: any) {
        if (typeof key === 'object' && key.label) {
            key = key.label;
        }
        return i18next.t(key);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    onSelect($event) {
        this.select.emit($event);
    }

    ngOnChanges() {}
}

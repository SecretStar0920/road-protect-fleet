<template>
    <div class="financials">
        <h4 class="title is-4">Infringement Finances Summary</h4>
        <p>
            The following graph depicts the value and count of infringements nominated to this account based on their status
        </p>
        <br>
        <div class="chart">
            <client-only>
                <apexchart height="500" type="donut" :options="options" :series="series" />
            </client-only>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { SingleSeries } from '~/models/chart-data.model';

@Component({})
export default class Financials extends Vue {
    @Prop() data!: SingleSeries;

    get series() {
        return this.data.map(d => d.value);
    }

    get options() {
        return {
            labels: this.data.map(d => d.name),
            additional: this.data.map(d => d.extra),
            chart: {
                id: 'vuechart-example',
                toolbar: { show: false },
                animations: { enabled: false },
            },
            theme: {
                mode: 'light',
                palette: 'palette1',
            },
            dataLabels: {
                enabled: true,
                formatter: (val, opt) => {
                    const config = opt.w.config;
                    return `${config.labels[opt.seriesIndex]} | ${config.additional[opt.seriesIndex].count} @ ${
                        config.series[opt.seriesIndex]
                    }`;
                },
            },
        };
    }
}
</script>
<style scoped lang="less"></style>

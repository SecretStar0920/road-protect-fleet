<template>
    <div>
        <TitlePage />
        <Financials :data="financialsReportingData"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { NuxtAxiosInstance } from '~/node_modules/@nuxtjs/axios';
import WeeklyReportTitlePage from '~/components/weekly-report/WeeklyReportTitlePage.vue';
import Financials from '~/components/weekly-report/sections/Financials.vue';
import { SingleSeries } from '~/models/chart-data.model';

@Component({
    components: { Financials, TitlePage: WeeklyReportTitlePage },
})
export default class WeeklyReport extends Vue {
    financialsReportingData!: SingleSeries;

    async asyncData({ $axios, route }: { $axios: NuxtAxiosInstance; route: any }) {
        $axios.setHeader('service-name', 'document-renderer');
        const financialsReporting = await $axios.$post(
            `http://backend:8080/api/v1/account/${route.params.id}/weekly-reporting/infringement/amount`,
        );

        return {
            financialsReportingData: financialsReporting.data
        };
    }

    async mounted() {}
}
</script>

<style scoped lang="less"></style>

<template>
    <div class="document-root">
        <h1 class="title">הֲפָרַת הַחוֹק</h1>
        <table class="table table-is-fullwidth">
<!--            <thead>-->
<!--                <tr>-->
<!--                    <td></td>-->
<!--                    <td></td>-->
<!--                </tr>-->
<!--            </thead>-->
            <tbody>
                <tr>
                    <td>מספר קנס</td>
                    <td>{{ getValue('noticeNumber') }}</td>
                </tr>
                <tr>
                    <td>רישוי רכב</td>
                    <td>{{ getValue('vehicle') }}</td>
                </tr>
                <tr>
                    <td>תאריך עבירה</td>
                    <td>{{ getValue('offenceDate') }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { NuxtAxiosInstance } from '~/node_modules/@nuxtjs/axios';
import PowerOfAttorneyTitlePage from '~/components/power-of-attorney/PowerOfAttorneyTitlePage.vue';
import { GeneratedDocument } from '~/models/generated-document.model';
import moment from 'moment';

@Component({
    components: { PowerOfAttorneyTitlePage },
})
export default class InfringementDocument extends Vue {
    generatedDocument!: GeneratedDocument;

    get date() {
        return moment().format('HH:mm DD/MM/YYYY');
    }

    getValue(fieldName: string) {
        const field = this.generatedDocument.form.fields[fieldName];
        if (field && this.generatedDocument.form.fields[fieldName].value) {
            return this.generatedDocument.form.fields[fieldName].value;
        }

        return '_______________________';
    }

    async asyncData({ $axios, route }: { $axios: NuxtAxiosInstance; route: any }) {
        $axios.setHeader('service-name', 'document-renderer');
        const generatedDocument = await $axios.$get(`http://backend:8080/api/v1/generated-document/${route.params.id}/renderer`);
        return {
            generatedDocument,
        };
    }

    async mounted() {}
}
</script>

<style scoped lang="less"></style>

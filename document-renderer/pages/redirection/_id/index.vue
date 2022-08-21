<template>
    <div class="document-root">
        <p>
            לכל המעוניין,
        </p>
        <p>
            א.ג.נ,
        </p>
        <p style="margin-right: 14px; text-align: center;">הנדון: <span style="text-decoration: underline; font-weight: bold">אישור קיום הסכם השכרת רכב ולביצוע הסבה של חוב/ הודעות תשלום קנס</span></p>
        <p>
            אנו הח"מ,
        </p>
        <p>שם החברה: {{ getValue('userName') }}</p>
        <p>ח.פ.: {{ getValue('userIdentification') }}</p>
        <p>כתובת: {{ getValue('userLocation') }}</p>
        <p>(להלן: "השוכרת"),</p>
        <p>מצהירים בזה כי שכרנו מחברת {{ getValue('ownerName') }} ח.פ. {{ getValue('ownerIdentification') }} את:</p>
        <p>רכב בעל מס' רישוי {{ getValue('vehicleRegistration') }}</p>
        <p>לתקופה מתאריך {{ getValue('leaseStartDate') }}</p>
        <p>עד לתאריך {{ getValue('leaseEndDate') }}</p>
        <p class="spaced">
            הרינו לאשר כי בתקופה הנ"ל הרכב היה בחזקתנו ובשימושנו ואנו מבקשים מכל רשות מקומית ו/או משטרת ישראל ו/או כל גוף המפיק הודעות קנס ו/או חיוב, להסב כל חוב ו/או הודעת הקנס בגין שימוש ברכב בתקופה
            הנ"ל על שמינו.
        </p>
        <p style="text-decoration: underline; font-weight: bold;">
            ולראיה באנו על החתום:
        </p>
        <div>
            <p>
                חותמת החברה השוכרת:
            </p>
            <div class="stamp">
                <img v-if="hasValue('userStamp')" :src="getValue('userStamp')" alt="" style="width: 200px; height: 200px;" />
                <div v-else class="image-block"></div>
            </div>
        </div>
        <p>שם החותם ותפקידו בחברה השוכרת: {{ getValue('ownerNamePosition') }}.</p>
        <div>
            <p>חתימה</p>
            <div class="signature">
                <img v-if="hasValue('userSignature')" :src="getValue('userSignature')" alt="" style="width: 300px; height: 150px;" />
                <div v-else class="image-block"></div>
            </div>
        </div>
        <p>תאריך: {{ date }}.</p>
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
export default class RedirectionDocument extends Vue {
    generatedDocument!: GeneratedDocument;

    get date() {
        return moment().format('HH:mm DD/MM/YYYY');
    }

    getValue(fieldName: string) {
        if (this.hasValue(fieldName)) {
            return this.generatedDocument.form.fields[fieldName].value;
        }

        return '_______________________';
    }

    hasValue(fieldName: string) {
        const field = this.generatedDocument.form.fields[fieldName];
        if (!field) {
            return false;
        }
        if (!field.value) {
            return false;
        }

        return true;
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

<style scoped lang="less">
.image-block {
    width: 300px;
    height: 150px;
    margin-bottom: 14px;
    border-bottom: 1px solid gray;
}
</style>

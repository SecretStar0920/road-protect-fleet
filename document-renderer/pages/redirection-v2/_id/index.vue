<template>
    <div class="document-root">
        <img
            v-if="hasValue('ownerFleetManagerLogo')"
            :src="getValue('ownerFleetManagerLogo')"
            height="94px"
            alt=""
            style="display: block; margin-left: auto; margin-right: auto; height: 94px !important; width: auto"
        />
        <br />
        <div class="columns">
            <div class="column">
                <p>לכבוד</p>
                <p>עיריית {{ getValue('municipalityName') }}</p>
            </div>
            <div class="column" style="margin-right: 200px">תאריך {{ date }}</div>
        </div>
        <p style="margin-right: 20px">
            הנדון:
            <span style="text-decoration: underline"
                >בקשה להסבה של הודעת תשלום קנס מס' {{ getValue('infringementNoticeNumber') }} (להלן: "הקנס")</span
            >
        </p>
        <br />
        <p>
            אני הח"מ {{ getValue('ownerFleetManagerName') }} בעל ת.ז. מס' {{ getValue('ownerFleetManagerId') }} שהוסמכתי על ידי
            {{ getValue('ownerCompanyName') }} ח.פ.
            {{ getValue('ownerBrn') }}
            (להלן: "החברה") מגיש בקשה ותצהיר זה מטעם החברה לביטול הקנס שבנדון והסבתו כמפורט להלן.
        </p>
        <div class="content" style="margin-right: 18px">
            <ol type="1">
                <li>
                    <div>
                        <p>
                            רכב מס' {{ getValue('vehicleRegistration') }} (להלן: "הרכב") שהינו בבעלות החברה / ברשות החברה על פי הסכם שכירות,
                            היה/הינו בחזקתו ובשימושו של:
                        </p>

                        <p><span style="text-decoration: underline">שם משתמש הרכב</span>: {{ getValue('targetName') }}</p>

                        <p><span style="text-decoration: underline">מס' מזהה של משתמש הרכב</span>: {{ getValue('targetIdentifier') }}</p>

                        <p>
                            <span style="text-decoration: underline">כתובת משתמש הרכב</span>: {{ getValue('targetAddress') }} <br />(ולהלן:
                            "המשתמש")<br />
                        </p>
                        <p>מיום {{ getDateValue('leaseStartDate') }} ועד ליום {{ getDateValue('leaseEndDate') }}.</p>
                    </div>
                </li>
                <li>
                    מאחר ובמועד רישום הקנס ביום {{ getDateValue('infringementOffenceDate') }} הרכב היה בחזקתו ובשימושו של המשתמש, והחברה לא
                    החזיקה ו/או לא שלטה ו/או לא השתמשה ברכב, הנכם מתבקשים להסב את הקנס על שם המשתמש.
                </li>
                <li>מצ"ב יפוי כוח מאת החברה אל הח"מ וכן העתק חוזה/ הסכמת המשתמש להסבה על שמו.</li>
            </ol>
        </div>
        <div>
            <div style="float: left">
                <span>בברכה,</span>
                <br />
                <img
                    v-if="hasValue('ownerFleetManagerSignature')"
                    :src="getValue('ownerFleetManagerSignature')"
                    alt=""
                    style="width: 300px; height: 150px"
                />
                <div v-else class="image-block"></div>
                <p>{{ getValue('ownerFleetManagerName') }} הכח בשם החברה</p>
            </div>
        </div>
        <br />
        <div>
            <div style="clear: both; padding: 10px; margin: auto; width: 80%" v-if="hasValue('ownerFleetManagerVehicleOfficerSignature')">
                <img :src="getValue('ownerFleetManagerVehicleOfficerSignature')" alt="" width="100%" />
            </div>
        </div>
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
        return moment().format('DD/MM/YYYY');
    }

    getValue(fieldName: string) {
        if (this.hasValue(fieldName)) {
            return this.generatedDocument.form.fields[fieldName].value;
        }

        return '_______________________';
    }

    getDateValue(fieldName: string) {
        if (this.hasValue(fieldName)) {
            return moment(this.generatedDocument.form.fields[fieldName].value).format('DD/MM/YYYY');
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
        // TODO: Ensure that we set http://backend:8080 in an env config so that
        //  we can change that in tests and at other stages without causing errors
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

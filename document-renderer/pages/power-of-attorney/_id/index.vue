<template>
    <div class="document-root">
        <!--        <PowerOfAttorneyTitlePage />-->
        <h1 class="title" style="text-align: center; text-decoration: underline">יפוי כוח</h1>

        <p>אני הח"מ,{{ getValue('name') }} ח.פ. {{ getValue('identifier') }} (להלן "החברה") באמצעות {{ getValue('lawyerName') }} בעל/ת ת.ז. מס' {{ getValue('lawyerId') }},</p>

        <p>
            מייפה בזאת את כוחם של חברת וואן פרוטקט בע"מ ח.פ. 515053726 ו/או חברת רואד פרוטקט בע"מ ח.פ. 515811230 ו/או מר אור גולדגמר ת.ז. 200048551 ו/או מר בני כץ ת.ז. 057279705 ו/או מר יצחק וייסמן,
            עו"ד מ.ר. 29725 ת.ז. 015306046 ו/או כל אחד אשר יוסמך בכתב על ידי מי מאלה, לבצע את הפעולות המפורטות להלן ביחס לרכב/ים שבבעלותי ו/או הנמצאים בשימושי על פי הסכם ביני לבין בעלת הרכב/ים (להלן:
            "הרכב/ים").
        </p>

        <div class="content" style="margin-right: 14px;">
            <ol type="1">
                <li>
                    לבקש, לדרוש, לעיין ולקבל כל מידע ביחס לכל קנס ו/או חוב ו/או דוחות החנייה אשר ניתנו ע"י הרשויות המוסמכות בהן, לרבות אך לא רק: פיקוח עירוני, סיירת ירוקה, משטרת ישראל או כל גוף אחר
                    המוסמך להשית קנסות חנייה ו/א ותעבורה בגין עבירות ו/או שימוש ברכב/ים.
                </li>
                <li>לחתום בשמנו ובמקומנו ו/או להגיש כל בקשה ו/או מסמך (ובכלל זה גם באופן מקוון) הנדרשים לצורך קבלת מידע ביחס לקנס ו/או חוב ו/או לדוחות החניה וכל מידע נוסף המפורט לעיל.</li>
                <li>
                    לחתום בשמנו ובמקומנו ו/או להגיש כל בקשה ו/או מסמך ו/או תצהיר (ובכלל זה גם באופן מקוון) הדרוש לצורך ביטולה של הודעת תשלום קנס שנרשמה בגין ביצוע עבירה ברכב של החברה ו/או שנמצא
                    בהחזקתה כדין והסבתה של הודעת תשלום קנס אל משתמש הרכב בפועל במועד ביצועה של העבירה.
                </li>
            </ol>
        </div>

        <div class="columns signature">
            <div class="column">
                <div class="top-block signature">
                    <img v-if="hasValue('signatureOne')" :src="getValue('signatureOne')" alt="" width="300px" height="150px"/>
                </div>
                <div class="bottom-block">חתימה + חותמת</div>
            </div>
            <div class="column">
                <div class="top-block">
                    {{ date }}
                </div>
                <div class="bottom-block">תאריך</div>
            </div>
        </div>

        <h1 class="title is-4" style="text-align: center; text-decoration: underline">אישור</h1>

        <p>
            אני הח"מ, {{ getValue('lawyerName') }} עוה"ד של {{ getValue('name') }} ח.פ. {{ getValue('identifier') }} (להלן: "החברה") מאשר/ת בזאת כי {{ getValue('representativeName') }} אשר חתמ/ה בפניי
            על יפוי כח זה, מוסמכ/ת ליתן יפוי כח זה מטעם החברה .
        </p>

        <div class="columns signature">
            <div class="column">
                <div class="top-block signature"><img v-if="hasValue('signatureTwo')" :src="getValue('signatureTwo')" alt="" width="300px" height="150px"/></div>
                <div class="bottom-block">חתימה + חותמת של עוה"ד</div>
            </div>
            <div class="column">
                <div class="top-block">{{ date }}</div>
                <div class="bottom-block">תאריך</div>
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
    export default class PowerOfAttorneyDocument extends Vue {
        generatedDocument!: GeneratedDocument;

        get date() {
            return moment().format('HH:mm DD/MM/YYYY');
        }

        getValue(fieldName: string) {
            if (this.hasValue(fieldName)) {
                return this.generatedDocument.form.fields[fieldName].value;
            }

            return '__________________';
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
            const url = `http://backend:8080/api/v1/generated-document/${route.params.id}/renderer`;
            const generatedDocument = await $axios.$get(url);
            return {
                generatedDocument,
            };
        }

        async mounted() {
        }
    }
</script>

<style scoped lang="less"></style>

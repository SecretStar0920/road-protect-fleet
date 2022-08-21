<template>
    <div class="page">
        <div class="page-content">
            <div class="logo">
                <img src="@/assets/images/sml_icon.png" alt="" />
            </div>
            <div class="info">
                <h1 class="title">Weekly Report</h1>
                <h2 class="subtitle">{{ accountName }}</h2>
                <h3 class="subtitle">{{ date }}</h3>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import moment from 'moment';

@Component({})
export default class WeeklyReportTitlePage extends Vue {
    get accountName() {
        return 'Entrostat (Pty) Ltd';
    }

    get date() {
        return moment().format('HH:mm DD/MM/YYYY');
    }
}
</script>
<style scoped lang="less">
.page {
    height: 100vh;
    page-break-after: always;
    position: relative;
    .page-content {
        position: absolute;
        left: 50%;
        top: 30%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .logo {
            text-align: center;
        }

        .info {
            text-align: center;
        }
    }
}
</style>

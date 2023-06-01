<template>
    <div class="header">
        <div class="label">
            Statistics
        </div>
        <div class="end">
            <n-date-picker v-model:value="timestamp" type="year" clearable class="datePicker" />
            <n-popconfirm @positive-click="handlePositiveClick" @negative-click="handleNegativeClick" class="confirm">
                <template #trigger>
                    <n-button>Clear data</n-button>
                </template>
                Are you sure you want to delete all the data for the year {{ year }}?
            </n-popconfirm>
        </div>
    </div>

    <n-spin v-if="show"></n-spin>
    <div v-else>
        <TotalFocusTimeAndTasks :data="data.totalCompletedTasksAndFocusTime" />
        <HeatmapForFocusTime :data="data.focusTimeHeatmapData" :year="year" />
        <LineChartForBill :data="data.lineChartDataForBill" />
        <PieChartForBill :data="data.pieChartDataForBill" />
        <BarChartForHabit :x-axis-data="data.barChartDataForHabit.xAxisData" :data="data.barChartDataForHabit.data" />
        <BarChartForMood :data="data.barChartDataForMood" />
        <n-card>
            <template #header>
                Year Summary
            </template>
            <n-input type="textarea" v-model:value="summary" class="summary">
                <template #suffix>
                    <n-icon class="icon" size="25">
                        <MoveToInboxFilled @click="updateSummary" />
                    </n-icon>
                </template>
            </n-input>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import TotalFocusTimeAndTasks from './overview/TotalFocusTimeAndTasks.vue';
import HeatmapForFocusTime from './overview/HeatmapForFocusTime.vue';
import LineChartForBill from './overview/LineChartForBill.vue';
import PieChartForBill from './overview/PieChartForBill.vue';
import BarChartForHabit from './overview/BarChartForHabit.vue';
import BarChartForMood from './overview/BarChartForMood.vue';
import {
    NButton,
    NInput,
    NDatePicker,
    NSpin,
    NIcon,
    NCard,
    NPopconfirm
} from 'naive-ui';
import { MoveToInboxFilled } from '@vicons/material';
import { onMounted, ref, watch } from 'vue';
import {
    getOverviewData,
    getEmptyOverviewData,
    clearYearData
} from '../../utils/data';
import { SqlUtil } from '../../utils/sql/sql';
import { objectToBlob, uint8ArrayToObject } from '../../utils/commons';
import { OverviewData } from '../../types/types';
import moment from 'moment';
import { Notice } from 'obsidian';

const data = ref(<OverviewData>{});
const show = ref(true);
const timestamp = ref(1672502400000);
const summary = ref("");
const year = ref(String(new Date(timestamp.value).getFullYear()));
onMounted(async () => {
    getDataFromStore();

    watch(() => timestamp.value, () => {
        year.value = String(new Date(timestamp.value).getFullYear());

        if (year.value != moment().format('YYYY')) {
            //load data
            getDataFromTable(year.value);
        } else {
            getDataFromStore();
        };
    })
});

const getDataFromStore = async () => {
    show.value = true;
    getOverviewData().then((result) => {
        data.value = result;
        getSummaryFromTable(year.value).then(() => {
            SqlUtil.updateDataToTable("overview", "data", objectToBlob(data.value), `${moment().format('YYYY')}`)
                .then(() => {
                    show.value = false;
                });
        });
    });
};

const updateSummary = () => {
    SqlUtil.updateDataToTable("overview", "summary", summary.value, `${year.value}`).then(() => {
        new Notice("Update year summary success!");
    });
};

const getDataFromTable = (year: string) => {
    show.value = true;
    SqlUtil.selectDataFromTable("overview", "data", `${year}`).then((result) => {
        if (Object.values(result).length != 0) {
            data.value = uint8ArrayToObject(result.data) as OverviewData;
        } else {
            data.value = getEmptyOverviewData(year);
            new Notice("No data!");
        }
        getSummaryFromTable(year).then(() => {
            show.value = false;
        })
    }).catch((e) => {
        console.log(e);
        new Notice("failed to load data!");
    });
}

const getSummaryFromTable = async (year: string) => {
    SqlUtil.selectDataFromTable("overview", "summary", `${year}`).then((result) => {
        if (Object.values(result).length != 0) {
            summary.value = result.summary as string;
            show.value = false;
        } else {
            summary.value = "";
        }
    }).catch((e) => {
        console.log(e);
        new Notice("failed to load data!");
    });
}

const handlePositiveClick = () => {
    clearYearData(year.value);
}

const handleNegativeClick = () => {
    new Notice("cancel delete data!");
}

</script>
<style scoped lang='less'>
.summary {
    height: 400px;
}

.icon:hover {
    cursor: pointer;
    color: hsl(352, 91%, 51%);
}

.header {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.label {
    text-align: left;
    margin-right: auto;
    font-weight: bold;
    font-size: 25px;
}

.end {
    display: inline-flex;
}

.datePicker {
    width: 90px;
    justify-content: end;
    margin-right: 5px;
}

.confirm {
    justify-content: end;
}

.backup {
    justify-content: end;
    margin-left: 5px;
}
</style>
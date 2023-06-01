<template>
    <n-card class="card">
        <template #header>
            Add Focus Record
        </template>

        <template #header-extra>
            <n-button @click="addFocusRecord" style="float: right;text-align: right;">
                <template #icon>
                    <add />
                </template>
            </n-button>
        </template>

        <div class="container">
            <label class="dateLabel">Date</label>
            <n-date-picker type="date" v-model:formatted-value="today" class="datePicker" :first-day-of-week="0"/>
            <label class="label">Start time</label>
            <n-time-picker format="HH:mm:ss" v-model:formatted-value="startTime" class="timePicker" />
            <label class="label">End time</label>
            <n-time-picker format="HH:mm:ss" v-model:formatted-value="endTime" class="timePicker" />
        </div>
    </n-card>
    <FocusRecord :timings="stopwatchInfoTimings" :today="today" />
</template>

<script setup lang="ts">
import {
    NDatePicker,
    NTimePicker,
    NButton,
    NCard
} from 'naive-ui'
import FocusRecord from './FocusRecord.vue'
import { Add } from '@vicons/ionicons5';
import moment from 'moment';
import { ref } from 'vue';
import { useCommonStore, useStopwatchInfoStore, useTaskItemStore } from '../../../stores'
import { Notice } from 'obsidian'
import { storeToRefs } from 'pinia';

const today = ref(moment().format('YYYY-MM-DD'));
const stopwatchInfoTimings = storeToRefs(useStopwatchInfoStore()).stopwatchInfo.value.timings;

const startTime = ref("00:00:00");
const endTime = ref("00:00:00");

const addFocusRecord = () => {
    const selectOption = useCommonStore().selectOption;
    const index = useTaskItemStore().taskItem.findIndex((taskItem) => taskItem.id === selectOption);
    let startTimeUnix = moment(today.value + " " + startTime.value, 'YYYY-MM-DD HH:mm:ss').unix();
    let endTimeUnix = moment(today.value + " " + endTime.value, 'YYYY-MM-DD HH:mm:ss').unix();
    let stopwatch = {
        startTime: startTimeUnix,
        endTime: endTimeUnix,
        pauseDuration: 0,
        tasks: [
            {
                startTime: startTimeUnix,
                endTime: endTimeUnix,
                taskId: selectOption,
                title: useTaskItemStore().taskItem[index].title,
            }
        ]
    }
    useStopwatchInfoStore().$patch((state) => {
        state.stopwatchInfo.timings.push(stopwatch);
    });
    useStopwatchInfoStore().updateStopwatchInfo({ timings: useStopwatchInfoStore().stopwatchInfo.timings });
    new Notice("Add Focus Record Successfully!");
}


</script>
<style scoped lang='less'>
.container {
    width: 100%;
    align-items: center;
    display: flex;

    .dateLabel {
        width: 8%;
    }

    .label {
        width: 14%;
        margin-left: 2%;
    }

    .datePicker {
        width: 28%;
    }

    .timePicker {
        width: 20%;
    }
}

.card {
    display: flex;
    margin: 40px 0px auto;
    padding: 0;
    text-align: left;
}
</style>
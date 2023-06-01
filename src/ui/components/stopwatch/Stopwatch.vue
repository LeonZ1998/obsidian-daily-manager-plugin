<template>
    <n-select v-model:value="selectOption" :options="options" class="selector" />

    <n-progress class="progress" type="circle" :percentage="stopwatchStateRefsData.progress" :gap-offset-degree="180"
        :show-indicator="true" indicator-placement="inside">
        <n-space vertical>
            <div>
                <span style="text-align: center;font-size: 150%;">{{ stopwatchStateRefsData.timePreview }}</span>
            </div>
            <div v-if="isPaused" style="text-align: center;font-size: 100%;">
                Pause
            </div>
        </n-space>
    </n-progress>

    <div style="text-align: center;" v-if="isDone">
        <n-button class="button" type="primary" strong secondary round @click="onStartClick">
            Start
        </n-button>
    </div>

    <div style="text-align: center;" v-if="!isDone">
        <n-button class="button" type="primary" strong secondary round @click="onPauseClick" v-if="!isPaused">
            Pause
        </n-button>
        <n-space vertical>
            <n-button class="button" type="primary" strong secondary round @click="onContinueClick" v-if="isPaused">
                Continue
            </n-button>
            <n-button class="button" type="primary" strong secondary round @click="onEndClick" v-if="isPaused">
                End
            </n-button>
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { NProgress, NButton, NSpace, NSelect } from 'naive-ui'
import { ref, watch, reactive, toRefs, onMounted, computed, onBeforeUnmount } from 'vue';
import moment from 'moment';
import { getDuration, formatDuration } from '../../../utils/time'
import type { Stopwatch, StopwatchState } from '../../../types/types'
import { useCommonStore, useStopwatchInfoStore, useStopwatchStateStore, useStopwatchStore, useTaskItemStore } from '../../../stores';
import { storeToRefs } from 'pinia';

const stopwatchRefs = storeToRefs(useStopwatchStore()).stopwatch;
const selectOption = storeToRefs(useCommonStore()).selectOption;
const stopwatchInfoRefs = storeToRefs(useStopwatchInfoStore()).stopwatchInfo;
const stopwatchStateRefsData = storeToRefs(useStopwatchStateStore()).stopwatchState;

const allTaskItem = storeToRefs(useTaskItemStore()).taskItem;
const options = computed(() => {
    return allTaskItem.value.filter((taskItem) => taskItem.scheduled != "" && taskItem.status === "Todo").map((taskItem) => ({
        label: taskItem.title,
        value: taskItem.id
    }));
});

const isDone = ref(true);
const isPaused = ref(false);
const timerStartTime = ref(0);
let intervalID = 0;
const duration = ref(0);

const stopwatchStateRefs = toRefs(reactive<StopwatchState>({
    intervalStatus: stopwatchStateRefsData.value.intervalStatus,
    progress: stopwatchStateRefsData.value.progress,
    timePreview: stopwatchStateRefsData.value.timePreview
}));

const startTimer = () => {
    timerStartTime.value = moment().unix();
    const totalTime = stopwatchStateRefs.timePreview.value;
    duration.value = 0;
    intervalID = window.setInterval(() => {
        duration.value = getDuration(timerStartTime.value);
        if (stopwatchStateRefs.intervalStatus.value == "progress") {
            let TotalTime = duration.value + moment.duration(totalTime).as('milliseconds');
            stopwatchStateRefs.timePreview.value = formatDuration(TotalTime);
            stopwatchStateRefs.progress.value = moment.duration(TotalTime).seconds() / 0.6;
        } else if (useStopwatchStateStore().stopwatchState.intervalStatus == "paused") {
            stopwatchRefs.value.pauseDuration += duration.value;
        }
    }, 1000);
}

onMounted(async () => {
    switch (stopwatchStateRefs.intervalStatus.value) {
        case "progress":
            isDone.value = false;
            isPaused.value = false;

            stopwatchStateRefs.intervalStatus.value = "progress";

            const closedTimeData = localStorage.getItem("closedTime");
            const closedTime = closedTimeData != null ? Number(JSON.parse(closedTimeData)) : 0;

            const totalTime = getDuration(closedTime) + moment.duration(stopwatchStateRefs.timePreview.value).as("milliseconds");
            stopwatchStateRefs.timePreview.value = formatDuration(totalTime);
            stopwatchStateRefs.progress.value = moment.duration(totalTime).seconds() / 0.6;
            startTimer();
            break;
        case "paused":
            isPaused.value = true;
            isDone.value = false;
            break;
        case "done":
            isDone.value = true;
            isPaused.value = false;
            break;
    }

    localStorage.removeItem("closedTime");

    watch(() => [stopwatchStateRefs.intervalStatus.value, stopwatchStateRefs.progress.value, stopwatchStateRefs.timePreview.value], () => {
        useStopwatchStateStore().updateStopwatchState({
            intervalStatus: stopwatchStateRefs.intervalStatus.value,
            progress: stopwatchStateRefs.progress.value,
            timePreview: stopwatchStateRefs.timePreview.value
        });
    });

    watch(() => selectOption.value, () => {
        if (stopwatchStateRefs.intervalStatus.value === "progress") {
            const index = allTaskItem.value.findIndex((taskItem) => taskItem.id === selectOption.value);
            stopwatchRefs.value.tasks[stopwatchRefs.value.tasks.length - 1].endTime = moment().unix();
            stopwatchRefs.value.tasks.push({
                startTime: moment().unix(),
                taskId: selectOption.value,
                title: allTaskItem.value[index].title,
            });

            useStopwatchStore().updateStopwatch({
                startTime: stopwatchRefs.value.startTime,
                pauseDuration: stopwatchRefs.value.pauseDuration,
                tasks: stopwatchRefs.value.tasks
            });
        };

        useCommonStore().updateSelectOption(selectOption.value);
    });
});

onBeforeUnmount(async () => {
    localStorage.setItem("closedTime", JSON.stringify(moment().unix()));
})

const onStartClick = () => {
    window.clearInterval(intervalID);
    isDone.value = false;
    isPaused.value = false;

    stopwatchStateRefs.intervalStatus.value = "progress";

    stopwatchRefs.value.startTime = moment().unix();
    const index = allTaskItem.value.findIndex((taskItem) => taskItem.id === selectOption.value);
    stopwatchRefs.value.tasks = [{
        startTime: stopwatchRefs.value.startTime,
        taskId: selectOption.value,
        title: allTaskItem.value[index].title,
    }];
    useStopwatchStore().updateStopwatch({
        startTime: stopwatchRefs.value.startTime,
        pauseDuration: 0,
        tasks: stopwatchRefs.value.tasks
    });

    startTimer();
}

const onPauseClick = () => {
    window.clearInterval(intervalID);

    isPaused.value = true;
    isDone.value = false;

    stopwatchStateRefs.intervalStatus.value = "paused";

    stopwatchRefs.value.tasks[stopwatchRefs.value.tasks.length - 1].endTime = moment().unix();

    startTimer();
}

const onContinueClick = () => {
    window.clearInterval(intervalID);
    isPaused.value = false;
    isDone.value = false;

    stopwatchStateRefs.intervalStatus.value = "progress";

    const index = allTaskItem.value.findIndex((taskItem) => taskItem.id === selectOption.value);
    stopwatchRefs.value.tasks.push({
        startTime: moment().unix(),
        taskId: selectOption.value,
        title: allTaskItem.value[index].title,
    });

    useStopwatchStore().updateStopwatch({
        startTime: stopwatchRefs.value.startTime,
        pauseDuration: stopwatchRefs.value.pauseDuration,
        tasks: stopwatchRefs.value.tasks
    });

    startTimer();
}

const onEndClick = () => {
    isDone.value = true;
    isPaused.value = false;

    stopwatchStateRefs.intervalStatus.value = "done";
    stopwatchStateRefs.progress.value = 0;
    stopwatchStateRefs.timePreview.value = "00:00:00";

    let stopwatchData: Stopwatch = {
        startTime: stopwatchRefs.value.startTime,
        pauseDuration: stopwatchRefs.value.pauseDuration,
        tasks: stopwatchRefs.value.tasks,
        endTime: moment().unix()
    };

    stopwatchInfoRefs.value.timings.push(stopwatchData);
    useStopwatchInfoStore().updateStopwatchInfo(stopwatchInfoRefs.value);
}

</script>
<style scoped lang='less'>
.selector {
    width: 80%;
    display: block;
    margin: 0 auto;
    text-align: center;
}

.progress {
    width: 40%;
    display: block;
    margin: 20px auto;
}

.button {
    width: 25%;
}
</style>
<template>
    <n-card>
        <template #header>
            Focus Record
        </template>
        <n-list hoverable clickable v-for="(stopwatch, id) of stopwatchInfoTimings">
            <n-list-item :key="id">
                <n-timeline>
                    <n-timeline-item>
                        <template #icon>
                            <n-icon size="20">
                                <alarm />
                            </n-icon>
                        </template>

                        <template #header>
                            {{ getTime(stopwatch.startTime) + " ~ " + getTime(stopwatch.endTime as number) }}
                            <n-icon @click="removeFocusRecord(id)" style="float: right;">
                                <trash />
                            </n-icon>
                        </template>
                    </n-timeline-item>
                    <n-timeline-item line-type="dashed" v-for="task of stopwatch.tasks">
                        <template #icon>
                            <airplane />
                        </template>
                        <template #header>
                            {{ task.title }}
                        </template>
                        <div>
                            <n-icon>
                                <radio-button-on-sharp />
                            </n-icon>
                            {{ getTime(task.startTime) + " ~ " + getTime(task.endTime as number) }}
                        </div>
                        <div>
                            <n-icon><radio-button-on-sharp /></n-icon>
                            {{ formatDuration(getTaskDuration(task)) }}
                        </div>
                    </n-timeline-item>
                </n-timeline>
            </n-list-item>
        </n-list>
    </n-card>
</template>

<script setup lang="ts">
import {
    NIcon,
    NList,
    NListItem,
    NTimeline,
    NTimelineItem,
    NCard,
} from 'naive-ui'
import { Airplane, Alarm, Trash, RadioButtonOnSharp, Add } from '@vicons/ionicons5';
import { computed } from 'vue';
import { useStopwatchInfoStore } from '../../../stores'
import { getDate, getTime, getTaskDuration, formatDuration } from '../../../utils/time'
import { Stopwatch } from '../../../types/types';
import { SqlUtil } from '../../../utils/sql/sql';
import { objectToBlob } from '../../../utils/commons';

const props = defineProps<{
    timings: Stopwatch[],
    today: string
}>();

const stopwatchInfoTimings = computed(() => {
    return props.timings.filter((stopwatch) => (getDate(stopwatch.startTime) == props.today));

});

const removeFocusRecord = (id: number) => {
    useStopwatchInfoStore().$patch((state) => {
        state.stopwatchInfo.timings.splice(state.stopwatchInfo.timings.indexOf(stopwatchInfoTimings.value[id]), 1);
        SqlUtil.updateTableUncondtionlly("store", "stopwatchInfo", objectToBlob(state.stopwatchInfo));
    })
}

</script>
<style scoped lang='less'></style>
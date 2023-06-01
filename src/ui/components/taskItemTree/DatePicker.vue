<template>
    <n-popover trigger="manual" placement="bottom" :on-clickoutside="clickoutside" :show="showPopover">
        <template #trigger>
            <n-icon class="icon-class" @click="showPopover = !showPopover">
                <CalendarMonthOutlined />
            </n-icon>
        </template>
        <template #header>
            <n-space justify="center">
                <n-button quaternary round type="primary" @click="isDuration = false">
                    Date
                </n-button>
                <n-button quaternary round type="primary" @click="isDuration = true">
                    Duration
                </n-button>
            </n-space>
        </template>
        <div v-if="!isDuration">
            <n-date-picker panel type="date" :first-day-of-week="0" v-model:formatted-value="scheduled"
                style="margin: 0 auto;" />
        </div>
        <div v-if="isDuration">
            <n-space vertical>
                <div class="container">
                    <label for="datepicker">Start</label>
                    <n-date-picker type="date" v-model:formatted-value="start" id="datepicker" :first-day-of-week="0" />
                </div>
                <div class="container">
                    <label for="datepicker">Due</label>
                    <n-date-picker type="date" v-model:formatted-value="due" id="datepicker" :first-day-of-week="0" />
                </div>
            </n-space>
        </div>
        <template #footer>
            <n-space justify="center">
                <n-button strong secondary type="primary" @click="clear(taskItemID)" style="width: 100px;">
                    Clear
                </n-button>
                <n-button strong secondary type="primary" @click="updateTaskItemDate(taskItemID)" style="width: 100px;">
                    OK
                </n-button>
            </n-space>
        </template>
    </n-popover>
</template>

<script setup lang="ts">
import {
    NButton,
    NSpace,
    NIcon,
    NDatePicker,
    NPopover,
} from 'naive-ui'
import { CalendarMonthOutlined } from "@vicons/material"
import { ref } from 'vue'
import { useTaskItemStore } from '../../../stores';
import { SqlUtil } from '../../../utils/sql/sql';

defineProps<{
    taskItemID: string
}>()

const showPopover = ref(false);
const isDuration = ref(false);

const start = ref(null);
const due = ref(null);
const scheduled = ref(null);

const updateTaskItemDate = (id: string) => {
    if (isDuration.value) {
        useTaskItemStore().$patch((state) => {
            const index = state.taskItem.findIndex((taskItem) => (taskItem.id === id));
            const startDate: string = start.value === null ? "" : start.value;
            const duetDate: string = due.value === null ? "" : due.value;
            state.taskItem[index].start = startDate;
            state.taskItem[index].due = duetDate;
            SqlUtil.updateDataToTable("tasks", "start", startDate, `${id}`);
            SqlUtil.updateDataToTable("tasks", "due", duetDate, `${id}`);
        });
    } else {
        useTaskItemStore().$patch((state) => {
            const index = state.taskItem.findIndex((taskItem) => (taskItem.id === id));
            const scheduledtDate: string = scheduled.value === null ? "" : scheduled.value;
            state.taskItem[index].scheduled = scheduledtDate;
            SqlUtil.updateDataToTable("tasks", "scheduled", scheduledtDate, `${id}`);
        });
    }
    showPopover.value = false;
}


const clear = (id: string) => {
    start.value = null;
    due.value = null;
    scheduled.value = null;

    useTaskItemStore().$patch((state) => {
        const index = state.taskItem.findIndex((taskItem) => (taskItem.id === id));
        state.taskItem[index].start = "";
        state.taskItem[index].due = "";
        state.taskItem[index].scheduled = "";
        state.taskItem[index].status = "Todo";
        SqlUtil.updateDataToTable("tasks", "start", "", `${id}`);
        SqlUtil.updateDataToTable("tasks", "due", "", `${id}`);
        SqlUtil.updateDataToTable("tasks", "scheduled", "", `${id}`);
        SqlUtil.updateDataToTable("tasks", "status", "Todo", `${id}`);
    });
    showPopover.value = false;
}

const clickoutside = () => {
    showPopover.value = false;
}

</script>
<style scoped lang='less'>
.icon-class:hover {
    cursor: pointer;
}

.container {
    display: flex;
    align-items: center;
}

label {
    width: 40px;
    margin-right: 5px;
    display: inline-block;
    text-align: center;
}
</style>
<template>
    <n-input v-model:value="taskItem.title" @keydown.enter="updateTaskItemTitle(taskItem.id, taskItem.title)"
        @change="updateTaskItemTitle(taskItem.id, taskItem.title)" placeholder="Input task title,press enter to save!"
        :autofocus="true" style="margin-bottom: 5px;">
        <template #prefix>
            <n-icon @click="updateExpanded(taskItem.id)" v-if="taskItem.childs.length != 0" class="icon">
                <KeyboardArrowRightFilled v-if="!taskItem.isExpanded" />
                <KeyboardArrowDownTwotone v-else />
            </n-icon>
            <div class="indent" v-if="taskItem.childs.length === 0"></div>
            <n-checkbox :checked-value="taskItem.id" @update:checked="updateCheckedKey" v-if="taskItem.status != 'Done'"
                :checked="unchecked" />
            <n-checkbox :unchecked-value="taskItem.id" @update:checked="updateUncheckedKey" v-if="taskItem.status == 'Done'"
                :checked="checked" />
        </template>
        <template #suffix>
            <Suffix :taskItem="taskItem" />
        </template>
    </n-input>
</template>

<script setup lang="ts">
import {
    NCheckbox,
    NInput,
    NIcon,
} from 'naive-ui'
import { KeyboardArrowRightFilled, KeyboardArrowDownTwotone } from "@vicons/material"
import { computed, ref } from 'vue'
import { TaskItem } from '../../../types/types';
import { useTaskItemStore } from '../../../stores';
import moment from 'moment';
import { getDate } from '../../../utils/time';
import Suffix from './Suffix.vue'
import { SqlUtil } from '../../../utils/sql/sql';

const taskItemProps = defineProps<{
    taskItem: TaskItem
}>();

const taskItem = computed(() => {
    return taskItemProps.taskItem;
})

const today = ref(getDate(moment().unix()));
const checked = ref(true);
const unchecked = ref(false);

const updateExpanded = (id: string) => {
    useTaskItemStore().$patch((state) => {
        const index = state.taskItem.findIndex((taskItem) => (taskItem.id === id));
        state.taskItem[index].isExpanded = !state.taskItem[index].isExpanded;
        const isExpandedValue = state.taskItem[index].isExpanded ? 1 : 0;
        SqlUtil.updateDataToTable("tasks", "isExpanded", isExpandedValue, `${id}`);
    });
}

const updateTaskItemTitle = (id: string, title: string) => {
    useTaskItemStore().$patch((state) => {
        const index = state.taskItem.findIndex((taskItem) => (taskItem.id === id));
        state.taskItem[index].title = title;
        SqlUtil.updateDataToTable("tasks", "title", title, `${id}`);
    });
}

const updateCheckedKey = (id: string) => {
    useTaskItemStore().$patch((state) => {
        const index = state.taskItem.findIndex((taskItem) => (taskItem.id === id));
        state.taskItem[index].status = "Done";
        state.taskItem[index].completed = today.value;
        SqlUtil.updateDataToTable("tasks", "status", "Done", `${id}`);
        SqlUtil.updateDataToTable("tasks", "completed", today.value, `${id}`);
    });
}

const updateUncheckedKey = (id: string) => {
    useTaskItemStore().$patch((state) => {
        const index = state.taskItem.findIndex((taskItem) => (taskItem.id === id));
        state.taskItem[index].status = "Todo";
        state.taskItem[index].completed = "";
        SqlUtil.updateDataToTable("tasks", "status", "Todo", `${id}`);
        SqlUtil.updateDataToTable("tasks", "completed", "", `${id}`);
    });
}

</script>
<style scoped lang='less'>
.icon:hover {
    cursor: pointer;
}

.indent {
    margin-left: 16px;
}
</style>
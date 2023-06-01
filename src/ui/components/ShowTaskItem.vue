<template>
    <n-input round placeholder="Add tasks, press enter to save!" v-model:value="text" @keydown.enter="addItem(text)" />

    <n-collapse style="margin-top: 15px;" v-if="collapaseItem.length != 0">
        <n-collapse-item :title="collapase.title" v-for="collapase of collapaseItem">
            <template #header-extra>
                <n-badge :value="collapase.taskItems.length" />
            </template>
            <TaskItemTree :taskItems="collapase.taskItems" />
        </n-collapse-item>
    </n-collapse>

    <n-empty description="No TaskItem!" size="huge" style="margin-top: 15px;" v-else />
</template>

<script setup lang="ts">
import {
    NCollapse,
    NCollapseItem,
    NInput,
    NBadge,
    NEmpty
} from 'naive-ui'
import { computed, ref, watch } from 'vue';
import moment from 'moment';
import { getDate } from '../../utils/time';
import { TaskItem, taskItemData } from '../../types/types';
import { useTaskItemStore } from '../../stores';
import { v4 as uuid4 } from 'uuid';
import TaskItemTree from './taskItemTree/TaskItemTree.vue';
import { storeToRefs } from 'pinia';
import { SqlUtil } from '../../utils/sql/sql';

const text = ref('');
const today = ref(getDate(moment().unix()));

const allTaskItem = storeToRefs(useTaskItemStore()).taskItem;

const taskItemList = ref(<TaskItem[][]>{});
const collapaseItem = computed(() => {
    if (Object.keys(useTaskItemStore().$state.taskItem).length != 0) {
        taskItemList.value = parseData();
        return [
            {
                title: "Today",
                taskItems: taskItemList.value[0],
            },
            {
                title: "Projects",
                taskItems: taskItemList.value[1],
            },
            {
                title: "Inbox",
                taskItems: taskItemList.value[2],
            },
            {
                title: "Scheduled",
                taskItems: taskItemList.value[3],
            },
            {
                title: "Completed",
                taskItems: taskItemList.value[4],
            },
            {
                title: "Won't Do",
                taskItems: taskItemList.value[5],
            }
        ]
    } else {
        return [];
    }
})

let taskItem: Partial<TaskItem>;
const addItem = (inputText: string) => {
    taskItem = {
        id: uuid4().replace(/-/g, ''),
        title: inputText,
        status: "Todo"
    }
    if (Object.keys(useTaskItemStore().$state.taskItem).length != 0) {
        useTaskItemStore().taskItem.push({ ...taskItemData, ...taskItem });
    } else {
        useTaskItemStore().taskItem = [{ ...taskItemData, ...taskItem }];
    }
    text.value = '';
    SqlUtil.insertIntoTable("tasks", { ...taskItemData, ...taskItem });
}

function parseData() {
    const allTodoTaskItem = allTaskItem.value.filter((taskItem) => taskItem.status === "Todo");

    const todayTaskItems = allTodoTaskItem
        .filter((taskItem) => taskItem.scheduled === today.value);

    const inboxTaskItems = allTodoTaskItem
        .filter((taskItem) => taskItem.start === "" && taskItem.due === "" && taskItem.scheduled === "" && taskItem.parentId === "");

    const contextTaskItems = allTodoTaskItem
        .filter((taskItem) => taskItem.start === "" && taskItem.due === "" && taskItem.scheduled != "" && taskItem.scheduled != today.value);

    const allWontdoTaskItem = allTaskItem.value
        .filter((taskItem) => taskItem.status === "Wont do");

    const allDoneTaskItem = allTaskItem.value
        .filter((taskItem) => taskItem.status === "Done");

    const allDoneSubTaskItem = allTaskItem.value.filter((taskItem) => taskItem.status === "Done" && taskItem.parentId != "");
    for (let task of allDoneTaskItem) {
        task.childs = parseSubTask(allDoneSubTaskItem, task.id);
        deleteSubTask(allDoneTaskItem, task.childs);
    }

    const projectTaskItems = allTodoTaskItem
        .filter((taskItem) => taskItem.start != "" && taskItem.due != "" && taskItem.parentId === "");
    const allTodoSubTaskItem = allTaskItem.value.filter((taskItem) => taskItem.status === "Todo" && taskItem.parentId != "");
    for (let project of projectTaskItems) {
        project.childs = parseSubTask(allTodoSubTaskItem, project.id);
    }

    return [todayTaskItems, projectTaskItems, inboxTaskItems, contextTaskItems, allDoneTaskItem, allWontdoTaskItem]
}

const parseSubTask = (tasks: TaskItem[], parentId: string): TaskItem[] => {
    const results = [];
    for (let task of tasks) {
        if (task.parentId === parentId) {
            const subTasks = parseSubTask(tasks, task.id);
            task.childs = subTasks;
            results.push(task);
        }
    }
    return results
}

const deleteSubTask = (tasks: TaskItem[], subTasks: TaskItem[]) => {
    for (let task of subTasks) {
        const index = tasks.findIndex((taskItem) => taskItem.id === task.id);
        tasks.splice(index, 1);
        deleteSubTask(tasks, task.childs);
    }
}

</script>
<style scoped lang='less'>
.icon-class:hover {
    cursor: pointer;
}
</style>
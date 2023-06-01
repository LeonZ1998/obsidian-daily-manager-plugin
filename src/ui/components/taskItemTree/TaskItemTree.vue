<template>
    <n-list v-for="taskItem of taskItems" class="tree" :show-divider="true">
        <TaskItemVue :taskItem="taskItem" />
        <TaskItemTree v-if="taskItem.childs.length != 0 && taskItem.isExpanded" :taskItems="taskItem.childs" />
    </n-list>
</template>

<script setup lang="ts">
import {
    NList,
} from 'naive-ui'
import { TaskItem } from '../../../types/types'
import TaskItemVue from './TaskItem.vue'

defineProps<{
    taskItems: TaskItem[],
}>()

</script>

<style scoped lang='less'>
.tree {
    margin-left: 10px;
}
</style>
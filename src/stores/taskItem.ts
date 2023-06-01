import { defineStore } from 'pinia'
import { TaskItem } from '../types/types'
import { Ref, ref } from 'vue'

export const useTaskItemStore = defineStore("taskItem", () => {
    const taskItem: Ref<TaskItem[]> = ref([]);

    return {
        taskItem,
    }
})
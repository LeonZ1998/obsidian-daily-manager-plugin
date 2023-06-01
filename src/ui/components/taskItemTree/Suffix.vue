<template>
  <n-space v-if="taskItem.status === 'Done'">
    <n-tag type="success" :bordered="false" size="small">
      {{ taskItem.completed }}
    </n-tag>
    <n-icon class="icon" @click="moveToTrash(taskItem.id)">
      <RestoreFromTrashRound />
    </n-icon>
  </n-space>
  <n-space v-else>
    <div v-if="taskItem.start != '' && taskItem.due != ''">
      <n-tag type="info" :bordered="false" size="small">
        {{ taskItem.start + " ~ " + taskItem.due }}
      </n-tag>
    </div>
    <div v-if="taskItem.scheduled != ''">
      <n-tag type="info" :bordered="false" size="small">
        {{ taskItem.scheduled }}
      </n-tag>
    </div>
    <DatePicker :taskItemID="taskItem.id" />
    <n-icon class="icon" v-if="(taskItem.start != '' && taskItem.due != '') || taskItem.parentId != ''">
      <AddOutlined @click="addSubTask(taskItem.id)" />
    </n-icon>
    <n-icon class="icon" @click="moveToTrash(taskItem.id)" v-if="taskItem.childs.length === 0">
      <RestoreFromTrashRound />
    </n-icon>
    <n-icon class="icon" @click="moveToWontdo(taskItem.id)" v-if="taskItem.status === 'Todo'">
      <CloseOutlined />
    </n-icon>
    <n-icon class="icon" @click="moveToInbox(taskItem.id)" v-if="taskItem.status === 'Wont do'">
      <SettingsBackupRestoreFilled />
    </n-icon>
  </n-space>
</template>

<script setup lang="ts">
import {
  NIcon,
  NSpace,
  NTag
} from 'naive-ui'
import { RestoreFromTrashRound, CloseOutlined, AddOutlined, SettingsBackupRestoreFilled } from "@vicons/material"
import { TaskItem, taskItemData } from '../../../types/types';
import { useTaskItemStore } from '../../../stores';
import { v4 as uuid4 } from 'uuid'
import DatePicker from './DatePicker.vue'
import { SqlUtil } from '../../../utils/sql/sql';

defineProps<{
  taskItem: TaskItem,
}>();

let subTaskItem: Partial<TaskItem>;
const addSubTask = (id: string) => {
  useTaskItemStore().$patch((state) => {
    const index = state.taskItem.findIndex((taskItem) => (taskItem.id === id));
    state.taskItem[index].isExpanded = true;
    const isExpandedValue = state.taskItem[index].isExpanded ? 1 : 0;
    SqlUtil.updateDataToTable("tasks", "isExpanded", isExpandedValue, `${id}`);
  });

  subTaskItem = {
    id: uuid4().replace(/-/g, ''),
    title: "",
    status: "Todo",
    parentId: id,
  }
  useTaskItemStore().taskItem.push({ ...taskItemData, ...subTaskItem });
  SqlUtil.insertIntoTable("tasks", { ...taskItemData, ...subTaskItem });
}

const moveToTrash = (id: string) => {
  useTaskItemStore().$patch((state) => {
    const index = state.taskItem.findIndex((taskItem) => (taskItem.id === id));
    state.taskItem.splice(index, 1);
    SqlUtil.deleteFromTable("tasks", `id = "${id}"`);
  });
}

const moveToWontdo = (id: string) => {
  useTaskItemStore().$patch((state) => {
    const index = state.taskItem.findIndex((taskItem) => (taskItem.id === id));
    state.taskItem[index].status = "Wont do";
    SqlUtil.updateDataToTable("tasks", "status", "Wont do", `${id}`);
  });
}

const moveToInbox = (id: string) => {
  useTaskItemStore().$patch((state) => {
    const index = state.taskItem.findIndex((taskItem) => (taskItem.id === id));
    state.taskItem[index].status = "Todo";
    SqlUtil.updateDataToTable("tasks", "status", "Todo", `${id}`);
  });
}

</script>
<style scoped lang='less'>
.icon:hover {
  cursor: pointer;
}
</style>
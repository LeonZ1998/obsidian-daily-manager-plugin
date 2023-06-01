<template>
  <n-list hoverable clickable :show-divider="true">
    <n-list-item v-for="habit in habits">
      <n-space justify="space-between">
        <n-tag round :bordered="false" style="width: 200px;" type="info">
          {{ habit.name }}
          <template #avatar>
            <n-icon size="25">
              <AddLocationOutlined />
            </n-icon>
          </template>
        </n-tag>
        <n-space justify="end">
          <n-icon size="30" @click="updateHabit(habit.id)" v-if="isShowHabit(habit) || habit.startDate === today">
            <CircleTwotone v-if="!isHabitChecked(habit, today)" />
            <CheckCircleOutlineRound v-else />
          </n-icon>
          <n-icon v-else size="30">
            <DoNotDisturbOnOutlined />
          </n-icon>
          <n-tag type="success" :bordered="false" style="width: 100px;text-align: center;">
            {{ habit.checkinStamp.length }}
            {{ habit.checkinStamp.length === 0 || habit.checkinStamp.length === 1 ? "day" : "days" }}
          </n-tag>
        </n-space>
      </n-space>

      <template #suffix>
        <n-icon @click="deleteHabit(habit.id)" size="15">
          <DeleteForeverFilled />
        </n-icon>
      </template>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import {
  NList,
  NListItem,
  NIcon,
  NTag,
  NSpace,
} from 'naive-ui';
import { AddLocationOutlined, CheckCircleOutlineRound, CircleTwotone, DeleteForeverFilled, DoNotDisturbOnOutlined } from '@vicons/material';
import { useHabitStore } from '../../../stores';
import moment from 'moment';
import { Habit } from '../../../types/types';
import { isHabitChecked } from "../../../utils/commons";

defineProps<{ habits: Habit[] }>();

const today = moment().format('YYYY-MM-DD');

const isShowHabit = (habit: Habit): boolean => {
  const diff = moment(today).diff(habit.startDate, 'days');
  if (diff % habit.repeat === 0) {
    return true;
  } else {
    return false;
  }
}

const updateHabit = (id: string) => {
  useHabitStore().updateCheckinStamp(id, today);
};

const deleteHabit = (id: string) => {
  useHabitStore().deleteHabit(id);
}

</script>
<style scoped lang='less'></style>
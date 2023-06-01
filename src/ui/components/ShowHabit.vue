<template>
    <n-collapse style="margin-bottom: 10px;" accordion>
        <n-collapse-item title="Add Habit">
            <AddHabit />
        </n-collapse-item>
        <n-collapse-item title="Add Habit Checkin Number">
            <AddHabitCheckin :habits="habits" />
        </n-collapse-item>
    </n-collapse>

    <HabitList :habits="habits" />
</template>

<script setup lang="ts">
import {
    NCollapse,
    NCollapseItem
} from 'naive-ui';
import AddHabit from './habit/AddHabit.vue';
import HabitList from './habit/HabitList.vue';
import AddHabitCheckin from './habit/AddHabitCheckin.vue';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useHabitStore } from '../../stores';
import { Habit } from '../../types/types';

const habits = ref(<Habit[]>[]);
habits.value = useHabitStore().habitItem;
</script>
<style scoped lang='less'></style>
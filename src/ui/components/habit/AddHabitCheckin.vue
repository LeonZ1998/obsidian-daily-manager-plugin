<template>
    <n-card class="card">
        <n-space justify="center" vertical>
            <div class="container">
                <label class="label">Habit</label>
                <n-select :options="options" v-model:value="selectHabit"></n-select>
            </div>
        </n-space>
    </n-card>
    <n-calendar v-if="selectHabit != ''" #="{ year, month, date }" class="calendar" @update:value="handleUpdateValue">
        <n-icon size="25">
            <RadioButtonCheckedSharp v-if="isCheckedToday(year, month, date)" />
            <RadioButtonUncheckedSharp v-else />
        </n-icon>
    </n-calendar>
</template>

<script setup lang="ts">
import {
    NCard,
    NSpace,
    NSelect,
    NCalendar,
    NIcon
} from 'naive-ui';
import { RadioButtonCheckedSharp, RadioButtonUncheckedSharp } from '@vicons/material';
import { ref } from 'vue';
import { Habit } from '../../../types/types';
import { useHabitStore } from '../../../stores/index';

const props = defineProps<{ habits: Habit[] }>();

const selectHabit = ref("");
const options = ref(props.habits.map((habit) => ({ label: habit.name, value: habit.id })));

const calToday = (year: any, month: any, date: any): string => {
    const monthStr: string = month < 10 ? String("0" + String(month)) : String(month);
    const dateStr: string = date < 10 ? String("0" + String(date)) : String(date);
    const today: string = String(year) + "-" + String(monthStr) + "-" + String(dateStr);
    return today;
}

const isCheckedToday = (year: any, month: any, date: any): boolean => {
    const today = calToday(year, month, date);
    const habit = useHabitStore().habitItem.find((habit) => habit.id === selectHabit.value);
    if (habit) {
        const index = habit.checkinStamp.findIndex((stamp) => stamp === today);
        if (index >= 0) {
            return true;
        }
    }
    return false;
}

const handleUpdateValue = (
    _: number,
    { year, month, date }: { year: number; month: number; date: number }
) => {
    const today = calToday(year, month, date);
    useHabitStore().updateCheckinStamp(selectHabit.value, today);
}

</script>
<style scoped lang='less'>
.container {
    width: 100%;
    align-items: center;
    display: flex;

    .label {
        width: 20%;
    }

    .com {
        width: 80%;
    }
}

.card {
    display: flex;
    margin: 0px auto;
    padding: 0;
    width: 90%;
    text-align: left;
    border-radius: 5px;
}

.calendar {
    height: 45%;
    border-radius: 5px;
    text-align: center;
}
</style>
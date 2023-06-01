<template>
    <n-card class="card">
        <template #header>
            Add Habit
        </template>
        <template #header-extra>
            <n-button style="float: right;text-align: right;" @click="addHabit">
                <template #icon>
                    <add />
                </template>
            </n-button>
        </template>

        <n-space justify="center" vertical>
            <div class="container">
                <label class="label">name</label>
                <n-input class="com" v-model:value="name"></n-input>
            </div>
            <div class="container">
                <label class="label">start date</label>
                <n-date-picker type="date" v-model:formatted-value="today" class="com" :first-day-of-week="0"/>
            </div>
            <div class="container">
                <label class="label">repeat</label>
                <n-input-number class="com" v-model:value="repeat">
                    <template #suffix>
                        day(s)
                    </template>
                </n-input-number>
            </div>
        </n-space>
    </n-card>
</template>

<script setup lang="ts">
import {
    NCard,
    NInput,
    NInputNumber,
    NDatePicker,
    NButton,
    NSpace
} from 'naive-ui';
import { Add } from '@vicons/ionicons5';
import { ref } from 'vue';
import moment from 'moment';
import { useHabitStore } from '../../../stores';
import { Habit } from '../../../types/types';
import { v4 as uuid4 } from 'uuid';

const name = ref("");
const today = ref(moment().format('YYYY-MM-DD'));
const repeat = ref(1);

const addHabit = () => {
    const habit: Habit = {
        id: uuid4().replace(/-/g, ''),
        name: name.value,
        checkinStamp: [],
        repeat: repeat.value,
        startDate: today.value,
    };
    name.value = "";
    useHabitStore().addHabit(habit);
};

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
</style>
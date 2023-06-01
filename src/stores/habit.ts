import { defineStore } from "pinia"
import { ref, Ref } from "vue"
import { Habit } from "../types/types"
import { isHabitChecked, objectToBlob } from "../utils/commons";
import { SqlUtil } from "../utils/sql/sql";

export const useHabitStore = defineStore("habit", () => {
    const habitItem: Ref<Habit[]> = ref([]);

    const addHabit = (habit: Habit) => {
        habitItem.value.push(habit);
        SqlUtil.updateTableUncondtionlly("store", "habits", objectToBlob(useHabitStore().habitItem));
    }

    const updateCheckinStamp = (id: string, date: string) => {
        const habit = habitItem.value.find((habit) => habit.id === id);
        if (habit) {
            if (!isHabitChecked(habit, date)) {
                habit.checkinStamp.push(date);
            } else {
                const index = habit.checkinStamp.findIndex((d) => d === date);
                if (index >= 0) {
                    habit.checkinStamp.splice(index, 1);
                }
            }
            SqlUtil.updateTableUncondtionlly("store", "habits", objectToBlob(habitItem.value));
        }
    }

    const deleteHabit = (id: string) => {
        const index = habitItem.value.findIndex(habit => habit.id === id);
        if (index >= 0) {
            habitItem.value.splice(index, 1);
            SqlUtil.updateTableUncondtionlly("store", "habits", objectToBlob(habitItem.value));
        }
    }

    return {
        habitItem,
        updateCheckinStamp,
        addHabit,
        deleteHabit
    }
})
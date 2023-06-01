import { defineStore } from "pinia"
import { ref, Ref } from "vue"
import type { Stopwatch } from "../types/types"
import { SqlUtil } from "../utils/sql/sql";
import { objectToBlob } from "../utils/commons";

export const useStopwatchStore = defineStore("stopwatch", () => {
    const stopwatch: Ref<Stopwatch> = ref(<Stopwatch>{
        startTime: 0,
        pauseDuration: 0,
        tasks: []
    });

    const updateStopwatch = (value: Stopwatch) => {
        stopwatch.value = value;
        SqlUtil.updateTableUncondtionlly("store", "stopwatch", objectToBlob(value));
    }

    return {
        stopwatch,
        updateStopwatch,
    }
})
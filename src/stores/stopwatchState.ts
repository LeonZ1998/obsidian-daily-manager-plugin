import { defineStore } from "pinia"
import { ref, Ref } from "vue"
import type { StopwatchState } from "../types/types"
import { SqlUtil } from "../utils/sql/sql";
import { objectToBlob } from "../utils/commons";

export const useStopwatchStateStore = defineStore("stopwatchState", () => {
    const stopwatchState: Ref<StopwatchState> = ref(<StopwatchState>{
        intervalStatus: "done",
        progress: 0,
        timePreview: "00:00:00"
    });

    const updateStopwatchState = (value: StopwatchState) => {
        stopwatchState.value = value;
        SqlUtil.updateTableUncondtionlly("store", "stopwatchState", objectToBlob(value));
    }

    return {
        stopwatchState,
        updateStopwatchState,
    }
});
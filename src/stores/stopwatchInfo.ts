import { defineStore } from "pinia"
import { ref, Ref } from "vue"
import { StopwatchInfo } from "../types/types"
import { SqlUtil } from "../utils/sql/sql";
import { objectToBlob } from "../utils/commons";

export const useStopwatchInfoStore = defineStore("StopwatchInfo", () => {
    const stopwatchInfo: Ref<StopwatchInfo> = ref(<StopwatchInfo>{ timings: [] });

    const updateStopwatchInfo = (value: StopwatchInfo) => {
        stopwatchInfo.value = value;
        SqlUtil.updateTableUncondtionlly("store", "stopwatchInfo", objectToBlob(value));
    }

    return {
        stopwatchInfo,
        updateStopwatchInfo,
    }
});
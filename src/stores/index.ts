import { createPinia } from "pinia";
import { useStopwatchStore } from "./stopwatch";
import { useStopwatchInfoStore } from './stopwatchInfo';
import { useStopwatchStateStore } from './stopwatchState';
import { useCommonStore } from "./commons";
import { useTaskItemStore } from './taskItem';
import { useBillStore } from './bill';
import { useHabitStore } from "./habit";
import { useReviewStore } from "./review";

const pinia = createPinia();

export default pinia;

export {
    useStopwatchStore,
    useStopwatchInfoStore,
    useStopwatchStateStore,
    useCommonStore,
    useTaskItemStore,
    useBillStore,
    useHabitStore,
    useReviewStore
};

import moment from "moment";
import {
    useBillStore,
    useHabitStore,
    useReviewStore,
    useStopwatchInfoStore,
    useTaskItemStore
} from "../stores";
import { formatMilliseconds, getDate, getTaskDuration, millisecondsToHeatmaplabel } from "./time";
import { OverviewData } from "../types/types";

const year = moment().format('YYYY');

export function extractYearFromDateString(dateString: string): string {
    const year = dateString.slice(0, 4);
    return year.toString();
}

export function getTotalCompletedTasksAndFocusTime() {
    const totalCompletedTasks = String(useTaskItemStore().taskItem
        .filter((task) => task.status === "Done" && extractYearFromDateString(task.completed) === year).length);

    const totalFocusTime = formatMilliseconds(useStopwatchInfoStore().stopwatchInfo.timings
        .filter((stopwatch) => moment.unix(stopwatch.startTime).format('YYYY') === year)
        .reduce((total, current) => total + current.tasks.reduce((a, b) => a + getTaskDuration(b), 0), 0));
    return [totalCompletedTasks, totalFocusTime];
}

export function getFocusTimeHeatmapData() {
    const data: [string, number, number][] = [];
    const daysInYear = moment(`${year}-12-31`).dayOfYear();

    for (let i = 1; i <= daysInYear; i++) {
        const date = moment(`${year}-01-01`).dayOfYear(i);
        const formattedDate = date.format('YYYY-MM-DD');
        const stopwatchInfoTimings = useStopwatchInfoStore().stopwatchInfo.timings;
        const focusTimeOfToday = stopwatchInfoTimings
            .filter((stopwatch) => (getDate(stopwatch.startTime) == formattedDate))
            .reduce((total, current) => total + current.tasks.reduce((a, b) => a + getTaskDuration(b), 0), 0);
        data.push([
            formattedDate,
            Object.values(stopwatchInfoTimings).length != 0 ? focusTimeOfToday : 0,
            Object.values(stopwatchInfoTimings).length != 0 ? millisecondsToHeatmaplabel(focusTimeOfToday) : 0
        ]);
    };
    return data;
}

export function getLineChartDataForBill() {
    const data: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const bills = useBillStore().billItem.filter((bill) => extractYearFromDateString(bill.date) === year);
    bills.forEach((bill) => {
        const billMonth = new Date(bill.date).getMonth();
        data[billMonth] += bill.price;
    });
    return data;
}

export function getPieChartDataForBill() {
    const data: { value: number, name: string }[] = [
        { value: 0, name: "Food" },
        { value: 0, name: "Shopping" },
        { value: 0, name: "Communication" },
        { value: 0, name: "Learning" },
        { value: 0, name: "Entertainment" },
        { value: 0, name: "Housing-related" },
        { value: 0, name: "Other" }
    ];
    const bills = useBillStore().billItem.filter((bill) => extractYearFromDateString(bill.date) === year);
    bills.forEach((bill) => {
        switch (bill.type) {
            case "Food":
                data[0].value += bill.price;
                break;
            case "Shopping":
                data[1].value += bill.price;
                break;
            case "Communication":
                data[2].value += bill.price;
                break;
            case "Learning":
                data[3].value += bill.price;
                break;
            case "Entertainment":
                data[4].value += bill.price;
                break;
            case "Housing-related":
                data[5].value += bill.price;
                break;
            case "Other":
                data[6].value += bill.price;
                break;
        }
    });
    return data;
}

export function getBarChartDataForHabit() {
    const xAxisData: string[] = [];
    const data: number[] = [];
    const habits = useHabitStore().habitItem;
    habits.forEach((habit) => {
        xAxisData.push(habit.name);
        data.push(habit.checkinStamp.filter((date) => extractYearFromDateString(date) === year).length);
    });
    return { xAxisData, data };
}

export function getBarChartDataForMood() {
    const data: number[] = [0, 0, 0, 0, 0];
    const reviews = useReviewStore().reviews.filter((review) => extractYearFromDateString(review.date) === year);
    reviews.forEach((review) => {
        switch (review.mood) {
            case "very happy":
                data[4] += 1;
                break;
            case "happy":
                data[3] += 1;
                break;
            case "common":
                data[2] += 1;
                break;
            case "pensive":
                data[1] += 1;
                break;
            case "angry":
                data[0] += 1;
                break;
        }
    });
    return data;
}

export function getOverviewData(): Promise<OverviewData> {
    return new Promise((resolve, reject) => {
        const overviewData: OverviewData = {
            totalCompletedTasksAndFocusTime: getTotalCompletedTasksAndFocusTime(),
            focusTimeHeatmapData: getFocusTimeHeatmapData(),
            lineChartDataForBill: getLineChartDataForBill(),
            pieChartDataForBill: getPieChartDataForBill(),
            barChartDataForHabit: getBarChartDataForHabit(),
            barChartDataForMood: getBarChartDataForMood(),
        };
        if (Object.values(overviewData).length != 0) {
            resolve(overviewData);
        } else {
            reject("No data!");
        }
    })
}

export async function clearYearData(selectedYear: string) {
    useBillStore().billItem = useBillStore().billItem
        .filter((bill) => extractYearFromDateString(bill.date) != selectedYear);

    useReviewStore().reviews = useReviewStore().reviews
        .filter((review) => extractYearFromDateString(review.date) != selectedYear);

    useTaskItemStore().taskItem = useTaskItemStore().taskItem
        .filter((task) => extractYearFromDateString(task.completed) != selectedYear);

    useStopwatchInfoStore().stopwatchInfo.timings = useStopwatchInfoStore().stopwatchInfo.timings
        .filter((stopwatch) => moment.unix(stopwatch.startTime).format('YYYY') != selectedYear);
}

export function getEmptyOverviewData(selectedYear: string) {
    const overview: OverviewData = {
        totalCompletedTasksAndFocusTime: ["0", "00:00:00"],
        focusTimeHeatmapData: getEmptyHeatmapData(selectedYear),
        lineChartDataForBill: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        pieChartDataForBill: [
            { value: 0, name: "Food" },
            { value: 0, name: "Shopping" },
            { value: 0, name: "Communication" },
            { value: 0, name: "Learning" },
            { value: 0, name: "Entertainment" },
            { value: 0, name: "Housing-related" },
            { value: 0, name: "Other" }
        ],
        barChartDataForHabit: {
            xAxisData: [],
            data: []
        },
        barChartDataForMood: []
    };
    return overview;
}

export function getEmptyHeatmapData(selectedYear: string) {
    const data: [string, number, number][] = [];
    const daysInYear = moment(`${selectedYear}-12-31`).dayOfYear();

    for (let i = 1; i <= daysInYear; i++) {
        const date = moment(`${selectedYear}-01-01`).dayOfYear(i);
        const formattedDate = date.format('YYYY-MM-DD');

        data.push([formattedDate, 0, 0]);
    };
    return data;
}
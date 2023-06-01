export type TaskItem = {
    id: string,
    title: string,
    childs: TaskItem[],
    parentId: string,
    start: string,
    due: string,
    scheduled: string,
    completed: string,
    status: string,
    isExpanded: boolean,
}

export const taskItemData: TaskItem = {
    id: '',
    title: '',
    childs: [],
    parentId: '',
    start: '',
    due: '',
    scheduled: '',
    completed: '',
    status: "Todo",
    isExpanded: false,
}

export type Task = {
    startTime: number,
    endTime?: number,
    taskId: string,
    title: string
}

export type StopwatchInfo = {
    timings: Stopwatch[],
}

export type Stopwatch = {
    startTime: number,
    endTime?: number,
    pauseDuration: number,
    tasks: Task[],
}

export type StopwatchState = {
    intervalStatus: "done" | "progress" | "paused",
    progress: number,
    timePreview: string,
}

export type Bill = {
    date: string,
    content: string,
    type: string,
    platform: string,
    price: number
}

export type Imgurls = {
    results: any[]
}

export type Habit = {
    id: string,
    name: string,
    checkinStamp: string[],
    repeat: number,
    startDate: string,
}

export type DailyReview = {
    date: string,
    mood: string,
    summary: string,
}

export type OverviewData = {
    totalCompletedTasksAndFocusTime: string[],
    focusTimeHeatmapData: [string, number, number][],
    lineChartDataForBill: number[],
    pieChartDataForBill: { value: number, name: string }[],
    barChartDataForHabit: { xAxisData: string[], data: number[] },
    barChartDataForMood: number[],
}
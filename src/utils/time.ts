import moment from 'moment';
import { Stopwatch, Task } from '../types/types';

export function formatDuration(totalTime: number): string {
    let duration = moment.duration(totalTime);
    let hours = "00";
    let minutes = "00";
    let seconds = "00"
    if (duration.hours() < 10) {
        hours = "0" + String(duration.hours());
    } else {
        hours = String(duration.hours());
    }

    if (duration.minutes() < 10) {
        minutes = "0" + String(duration.minutes());
    } else {
        minutes = String(duration.minutes());
    }

    if (duration.seconds() < 10) {
        seconds = "0" + String(duration.seconds());
    } else {
        seconds = String(duration.seconds());
    }

    return hours + ":" + minutes + ":" + seconds;
}

export function getDuration(startTime: number): number {
    let endTime = moment();
    return endTime.diff(moment.unix(startTime), 'milliseconds');
}

export function getDate(time: number): string {
    return moment.unix(time).format('YYYY-MM-DD');
}

export function getTime(time: number): string {
    return moment.unix(time).format('HH:mm:ss');
}

export function getTaskDuration(task: Task): number {
    let endTimeMoment = moment.unix(task.endTime as number);
    return endTimeMoment.diff(moment.unix(task.startTime));
}

export function getStopwatchDuration(stopwatch: Stopwatch): number {
    return stopwatch.endTime as number - stopwatch.startTime - stopwatch.pauseDuration / 1000;
}

export function formatMilliseconds(milliseconds: number): string {
    const duration = moment.duration(milliseconds);
    const hours = Math.floor(duration.asHours()).toString().padStart(2, '0');
    const minutes = duration.minutes().toString().padStart(2, '0');
    const seconds = duration.seconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}


export function millisecondsToHeatmaplabel(milliseconds: number): number {
    if (milliseconds === 0) {
        return 0;
    } else if (milliseconds > 5 * 3600 * 1000) {
        return 4;
    } else if (milliseconds > 3 * 3600 * 1000) {
        return 3;
    } else if (milliseconds > 3600 * 1000) {
        return 2;
    }
    return 1;
}

export function extraMonthFromDate(date: string) {

}
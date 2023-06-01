import { Editor } from "obsidian";
import { Buffer } from "buffer";
import { Habit } from "../types/types";

export function arraysToObjectArray<T extends string, U>(
    keys: T[],
    values: U[][]
): Record<T, U>[] {
    return values.map((row) => {
        const obj: Record<T, U> = {} as Record<T, U>;

        row.forEach((value, index) => {
            obj[keys[index]] = value;
        });

        return obj;
    });
}

export function getCurrentSelection(editor: Editor) {
    const cursorPos = editor.getCursor();
    let content = editor.getSelection();
    if (!content) {
        if (cursorPos) {
            content = editor.getLine(cursorPos.line);
        }
    }
    return content;
}

export function isLocalImg(selection: string): boolean {
    const regex = /^!\[\[.*\]\]$/;
    return regex.test(selection);
}

export function imageUrlToHtml(imageUrl: string): string {
    return `<img src="${imageUrl}" style="zoom:100%">`;
}

export function objectToBlob(object: any): Buffer {
    const data = Buffer.from(JSON.stringify(object));
    return data;
}

export function blobToObject(buffer: Buffer) {
    const data = JSON.parse(Buffer.from(buffer).toString());
    return data;
}

export function isHabitChecked(habit: Habit, date: string) {
    if (habit.checkinStamp.find(stamp => stamp === date)) {
        return true;
    } else {
        return false;
    }
}

export function uint8ArrayToObject(arr: Uint8Array): object {
    const str = new TextDecoder().decode(arr);
    return JSON.parse(str);
}

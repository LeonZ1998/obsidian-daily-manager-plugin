import TaskStopwatchPlugin from "../main";
import { DailyManagerPluginSettings } from "../setting";
import { requestUrl } from "obsidian";

export interface PicGoResponse {
    success: string;
    msg: string;
    result: string[];
    fullResult: Record<string, any>[];
}

export interface IStringKeyMap<T> {
    [key: string]: T;
}

export class PicHandlers {
    settings: DailyManagerPluginSettings;
    plugin: TaskStopwatchPlugin;

    init(plugin: TaskStopwatchPlugin) {
        this.plugin = plugin;
        this.settings = this.plugin.settings;
    }

    async uploadFiles(fileList: Array<String>): Promise<any> {
        const response = await requestUrl({
            url: this.settings.uploadServer,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ list: fileList }),
        });

        const data = response.json;
        return data;
    }
}

export const PicHandler = new PicHandlers();
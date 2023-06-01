import { App, PluginSettingTab, Setting } from "obsidian";
import DailyMnagerPlugin from "./main";

export interface DailyManagerPluginSettings {
  uploadServer: string;
  dailyManagerDBPath: string;
}

export const DEFAULT_SETTINGS: DailyManagerPluginSettings = {
  uploadServer: "http://127.0.0.1:36677/upload",
  dailyManagerDBPath: "/"
}

export default class DailyMnagerSettingTab extends PluginSettingTab {
  plugin: DailyMnagerPlugin;

  constructor(app: App, plugin: DailyMnagerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'DB File Path' });
    new Setting(containerEl)
      .setName("db file path")
      .setDesc("daily manager db file path")
      .addText(text =>
        text
          .setPlaceholder("Please input db file path")
          .setValue(this.plugin.settings.dailyManagerDBPath)
          .onChange(async key => {
            this.plugin.settings.dailyManagerDBPath = key;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl('h2', { text: 'Image Uploader Setting' });

    //Piclist upload server
    new Setting(containerEl)
      .setName("upload server")
      .setDesc("upload server")
      .addText(text =>
        text
          .setPlaceholder("Please input piclist upload server")
          .setValue(this.plugin.settings.uploadServer)
          .onChange(async key => {
            this.plugin.settings.uploadServer = key;
            await this.plugin.saveSettings();
          })
      );
  }
}

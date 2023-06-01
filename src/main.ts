import { Notice, Plugin, PluginManifest, App, WorkspaceLeaf, Platform } from "obsidian";
import { DAILY_MANAGER_VIEW_TYPE, DailyMnagerView } from "./ui/view/view";
import TaskStopwatchSettingTab, { DailyManagerPluginSettings, DEFAULT_SETTINGS } from './setting';
import { SqlUtil } from "./utils/sql/sql";
import { PicHandler } from "./utils/pichandler";
import moment from "moment";

export default class DailyMnagerPlugin extends Plugin {
  settings: DailyManagerPluginSettings;
  view: DailyMnagerView;
  taskStopwatchDBPath: string;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async onload() {
    // register leafview 
    this.registerView(
      DAILY_MANAGER_VIEW_TYPE,
      (leaf: WorkspaceLeaf) => (this.view = new DailyMnagerView(leaf))
    );

    // add settingTab
    await this.loadSettings();
    this.addSettingTab(new TaskStopwatchSettingTab(this.app, this));

    this.addRibbonIcon("checkmark", "Open Daily Manager", (evt: MouseEvent) => {
      if (evt) {
        this.openTaskStopwatchView();
      }
    });

    SqlUtil.init(this);
    PicHandler.init(this);
  }

  openTaskStopwatchView() {
    new Notice("Open Daily Manager!");
    this.app.workspace.detachLeavesOfType(DAILY_MANAGER_VIEW_TYPE);
    this.app.workspace.getRightLeaf(false).setViewState({
      type: DAILY_MANAGER_VIEW_TYPE,
      active: true,
    });
  }

  async onunload() {
    localStorage.setItem("closedTime", JSON.stringify(moment().unix()));
    this.app.workspace
      .getLeavesOfType(DAILY_MANAGER_VIEW_TYPE)
      .forEach((leaf) => leaf.detach());
  }
}

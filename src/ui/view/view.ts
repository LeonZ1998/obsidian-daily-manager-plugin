import {
  Editor,
  FileSystemAdapter,
  ItemView,
  MarkdownFileInfo,
  MarkdownView,
  Menu,
  Notice,
  WorkspaceLeaf,
  normalizePath
} from "obsidian";
import { App as VueApp, createApp } from "vue";
import AppVue from "../App.vue";
import { createPinia } from 'pinia';
import {
  useTaskItemStore,
} from "../../stores";
import { SqlUtil } from "../../utils/sql/sql";
import {
  getCurrentSelection,
  imageUrlToHtml,
  isLocalImg
} from "../../utils/commons";
import { PicHandler } from "../../utils/pichandler";
import { DailyManagerPluginSettings } from "../../setting";
import { TaskItem, taskItemData } from "../../types/types";
import { v4 as uuid4 } from 'uuid';
import { unlink } from 'fs';
import moment from "moment";

const pinia = createPinia();

export const DAILY_MANAGER_VIEW_TYPE = "daily_manager-view";

export class DailyMnagerView extends ItemView {
  vueapp: VueApp;
  settings: DailyManagerPluginSettings;
  imgDir: string;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.onClose = this.onClose.bind(this);
    this.resizeBodyHeight = this.resizeBodyHeight.bind(this);
    this.editorMenuFunction = this.editorMenuFunction.bind(this);
  }

  getViewType() {
    return DAILY_MANAGER_VIEW_TYPE;
  }

  getDisplayText() {
    return "daily-manager";
  }

  getIcon(): string {
    return "checkmark";
  }

  async onOpen(): Promise<void> {
    this.vueapp = createApp(AppVue);
    this.vueapp.use(pinia);
    //load data
    SqlUtil.getAllFromTable().then(() => {
      this.mountVueApp();
      this.resizeBodyHeight();
    });

    this.getImgDir();

    this.registerEvent(this.app.workspace.on("quit", this.onClose));
    this.registerEvent(this.app.workspace.on('resize', this.resizeBodyHeight));
    this.registerEvent(this.app.workspace.on("editor-menu", this.editorMenuFunction));
  }

  mountVueApp() {
    const container = this.containerEl;
    container.empty();
    container.createEl(
      "div",
      {
        attr: {
          id: 'daily-manager-container',
        },
      },
      el => {
        this.vueapp.mount(el);
      });
  }

  resizeBodyHeight() {
    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;
    const body = document.getElementById("body");
    if (body) {
      body.style.maxHeight = String(innerHeight * 0.78) + "px";
      body.style.maxWidth = String(innerWidth) + "px";
      body.style.overflow = "auto";
    }
  }

  async getImgDir() {
    const basePath = (
      this.app.vault.adapter as FileSystemAdapter
    ).getBasePath().replace(/\\/g, '/');
    const appConfigPath = normalizePath(this.app.vault.configDir + "/app.json");
    const file = await (this.app.vault.adapter as FileSystemAdapter).read(
      normalizePath(appConfigPath)
    );
    const imgPath = JSON.parse(file).attachmentFolderPath;
    this.imgDir = imgPath === "/" ? basePath + imgPath : basePath + "/" + imgPath + "/";
  }

  async editorMenuFunction(menu: Menu, editor: Editor, info: MarkdownView | MarkdownFileInfo) {
    this.getMenus().forEach(menuMeta => {
      menu.addItem(item => {
        item
          .setTitle(menuMeta.title)
          .setIcon(menuMeta.icon)
          .onClick(async () => {
            menuMeta.clickFn(menu, editor, info);
          });
      });
    });
  }

  getMenus() {
    return [
      {
        title: "Add task to inbox",
        icon: 'pencil',
        clickFn: (menu: Menu, editor: Editor, info: MarkdownView | MarkdownFileInfo) => {
          const selection = getCurrentSelection(editor);
          this.addTaskItemFromMdFile(selection);
        }
      },
      {
        title: "Upload img to aliyun oss",
        icon: 'send',
        clickFn: (menu: Menu, editor: Editor, info: MarkdownView | MarkdownFileInfo) => {
          this.uploadImgToOSS(editor);
        }
      },
    ]
  }

  addTaskItemFromMdFile(selection: string) {
    let taskItem: Partial<TaskItem>;
    taskItem = {
      id: uuid4().replace(/-/g, ''),
      title: selection,
      status: "Todo"
    }
    if (Object.keys(useTaskItemStore().$state.taskItem).length != 0) {
      useTaskItemStore().taskItem.push({ ...taskItemData, ...taskItem });
    } else {
      useTaskItemStore().taskItem = [{ ...taskItemData, ...taskItem }];
    }
    SqlUtil.insertIntoTable("tasks", { ...taskItemData, ...taskItem });
  }

  async uploadImgToOSS(editor: Editor) {
    const selection = getCurrentSelection(editor);
    //isLocalImg
    if (isLocalImg(selection)) {
      //parse img path
      const imgName = selection.replace(/^!\[\[(.*)\]\]$/, '$1');
      const imgPath = this.imgDir + imgName;
      //upload img
      PicHandler.uploadFiles([imgPath]).then((res) => {
        if (res.success) {
          //replace md link
          editor.replaceSelection(imageUrlToHtml(res.result[0]));
          //delete local img
          unlink(imgPath, () => { });
          new Notice("Upload image success!");
        }
        new Notice("Upload image failed!");
      });
    } else {
      new Notice("This is not a local image!");
    }
  }

  async onClose() {
    localStorage.setItem("closedTime", JSON.stringify(moment().unix()));
    this.vueapp.unmount();
    new Notice("Closed Vueapp!");
  }
}

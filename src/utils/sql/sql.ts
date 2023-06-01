import { Database, QueryExecResult, SqlJsStatic } from "sql.js";
import { loadSQL } from "./sqljs";
import TaskStopwatchPlugin from "../../main";
import { FileSystemAdapter, Notice, normalizePath } from "obsidian";
import { Bill, DailyReview, Habit, Imgurls, Stopwatch, StopwatchInfo, StopwatchState, TaskItem } from "../../types/types";
import {
    useTaskItemStore,
    useBillStore,
    useStopwatchStateStore,
    useStopwatchStore,
    useStopwatchInfoStore,
    useCommonStore,
    useHabitStore,
    useReviewStore
} from "../../stores";
import { DBTables } from "../../schemas/table";
import { arraysToObjectArray, objectToBlob, uint8ArrayToObject } from "../commons";
import moment from "moment";
import { getOverviewData } from "../data";

export class SqlUtils {
    plugin: TaskStopwatchPlugin;
    taskstopwatchDB: Database;
    taskstopwatchDBPath: string;

    async init(plugin: TaskStopwatchPlugin) {
        this.plugin = plugin;
        const dbPath = normalizePath(this.plugin.settings.dailyManagerDBPath + "DailyManagerDB.mdb");
        this.taskstopwatchDBPath = dbPath;
        //load sql
        loadSQL().then((sqljs) => {
            this.getDB(sqljs, dbPath).then((db) => {
                this.taskstopwatchDB = db;
            });

            this.getAllTables(sqljs, dbPath).then((tables) => {
                //init database
                if (tables.length != DBTables.length) {
                    // create table
                    this.initiateDB();
                }
            });
        }).catch((e) => {
            console.log(e);
        });
    };

    getDB = async (sqlJS: SqlJsStatic, path: string) => {
        const buf = await this.getDBFile(path);
        if (buf) {
            return new sqlJS.Database(new Uint8Array(buf));
        }
        return new sqlJS.Database();
    };

    getDBFile = async (path: string) => {
        if (!(await this.plugin.app.vault.adapter.exists(normalizePath(path)))) {
            return null;
        }
        const file = await (this.plugin.app.vault.adapter as FileSystemAdapter).readBinary(
            normalizePath(path)
        );
        return file;
    };

    initiateDB = () => {
        DBTables.forEach(({ name, cols }) => {
            const columnDefinitions = cols.map(({ name, type }) => `${name} ${type}`).join(', ');
            this.taskstopwatchDB.run(`CREATE TABLE IF NOT EXISTS ${name} (${columnDefinitions})`);
        });
    };

    getAllTables = async (sqlJS: SqlJsStatic, path: string): Promise<string[]> => {
        let tables;
        const db = await this.getDB(sqlJS, path);
        try {
            tables = db.exec(
                "SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';"
            );
        } catch (e) {
            console.log(e);
            return [];
        }

        if (tables.length != 0) {
            const tableNames: string[] = tables[0].values.map((a) => a[0]) as string[];
            return tableNames;
        } else {
            return [];
        }
    };

    getAllFromTable = async () => {
        this.dbResultsToArray("tasks").then((result) => {
            useTaskItemStore().taskItem = result as TaskItem[];
        })

        this.dbResultsToArray("bills").then((result) => {
            useBillStore().billItem = result as Bill[];
        })

        this.dbResultsToArray("reviews").then((result) => {
            useReviewStore().reviews = result as DailyReview[];
        })

        this.dbResultsToArray("store").then((result) => {
            if (Object.values(result).length === 0) {
                this.initStoreTable();
            } else {
                this.loadDataToStore(result);
            }
        })

        this.dbResultsToArray("overview").then((result) => {
            if (Object.values(result).length === 0) {
                this.initOverviewTable();
            }
        });

        new Notice("Load data success!");
    };

    initStoreTable = async () => {
        const storeTableValue = {
            stopwatchState: objectToBlob(useStopwatchStateStore().stopwatchState),
            stopwatch: objectToBlob(useStopwatchStore().stopwatch),
            stopwatchInfo: objectToBlob(useStopwatchInfoStore().stopwatchInfo),
            habits: objectToBlob(useHabitStore().habitItem),
            selectOption: useCommonStore().selectOption,
            city: useCommonStore().city,
        };
        this.insertIntoTable("store", storeTableValue);
    }

    initOverviewTable = async () => {
        getOverviewData().then((result) => {
            this.insertIntoTable("overview",
                { year: moment().format('YYYY'), data: objectToBlob(result), summary: "" });
        });
    }

    loadDataToStore = async (result: Record<string, any>[]) => {
        useStopwatchStateStore().stopwatchState = uint8ArrayToObject(result[0].stopwatchState) as StopwatchState;
        useStopwatchStore().stopwatch = uint8ArrayToObject(result[0].stopwatch) as Stopwatch;
        useStopwatchInfoStore().stopwatchInfo = uint8ArrayToObject(result[0].stopwatchInfo) as StopwatchInfo;
        useHabitStore().habitItem = uint8ArrayToObject(result[0].habits) as Habit[];
        useCommonStore().selectOption = result[0].selectOption as string;
        useCommonStore().city = result[0].city as string;
    }

    dbResultsToArray = async (table: string): Promise<Record<string, any>[]> => {
        return new Promise((resolve) => {
            const sql = `SELECT * FROM ${table}`;
            const res: QueryExecResult[] = this.taskstopwatchDB.exec(sql);
            if (res[0] != undefined) {
                const result = arraysToObjectArray(res[0].columns, res[0].values);
                resolve(result);
            };
            resolve([]);
        });
    }

    insertIntoTable = (table: string, values: Record<string, any>) => {
        const columns = Object.keys(values).join(', ');
        const placeholders = Object.keys(values).map(() => '?').join(', ');
        const sqlstr = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        const params = Object.values(values);
        this.taskstopwatchDB.run(sqlstr, params);
        this.saveDBFile();
    }

    deleteFromTable = (table: string, condition: string) => {
        const sqlstr = `DELETE FROM ${table} WHERE ${condition};`;
        this.taskstopwatchDB.run(sqlstr);
        this.saveDBFile();
    };

    updateDataToTable = async (
        table: string,
        updateCol: string,
        updateValue: string | number | Buffer,
        conditionValue: string
    ) => {
        let conditionCol = "";
        switch (table) {
            case "tasks":
                conditionCol = "id";
                break;
            case "reviews":
                conditionCol = "date";
                break;
            case "overview":
                conditionCol = "year";
                break;
        };
        const sqlstr = `UPDATE ${table} SET ${updateCol} = ? WHERE ${conditionCol} = ?;`;
        this.taskstopwatchDB.exec(sqlstr, [updateValue, conditionValue]);
        this.saveDBFile();
    };

    updateTableUncondtionlly = async (
        table: string,
        updateCol: string,
        updateValue: string | Buffer,
    ) => {
        const sqlstr = `UPDATE ${table} SET ${updateCol} = ?;`;
        this.taskstopwatchDB.exec(sqlstr, [updateValue]);
        this.saveDBFile();
    };

    selectDataFromTable = async (
        table: string,
        selectedCol: string,
        conditionValue: string,
    ): Promise<Record<string, any>> => {
        let conditionCol = 'year';
        const sqlstr = `SELECT ${selectedCol} FROM ${table} WHERE ${conditionCol} = '${conditionValue}'`;
        const res: QueryExecResult[] = this.taskstopwatchDB.exec(sqlstr);
        if (res[0] != undefined) {
            const result = arraysToObjectArray(res[0].columns, res[0].values);
            return result[0];
        };
        return [];
    };

    saveDBFile = async () => {
        const file = (
            this.plugin.app.vault.adapter as FileSystemAdapter).writeBinary(normalizePath(this.taskstopwatchDBPath),
                this.taskstopwatchDB.export().buffer);
        return file;
    };
}

export const SqlUtil = new SqlUtils();
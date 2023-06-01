import sql_wasm from "./sqljs/sql-wasm.wasm?url";
import initSqlJs from "sql.js";

export const loadSQL = async () => {
    const sql = await initSqlJs({
        locateFile: () => sql_wasm,
    });
    return sql;
};
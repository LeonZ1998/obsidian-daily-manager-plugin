export interface Table {
    name: string,
    cols: { name: string, type: string }[]
}

export const tasksTable: Table = {
    name: "tasks",
    cols: [
        { name: 'id', type: 'TEXT' },
        { name: 'title', type: 'TEXT' },
        { name: 'childs', type: 'BLOB' },
        { name: 'parentId', type: 'TEXT' },
        { name: 'start', type: 'TEXT' },
        { name: 'due', type: 'TEXT' },
        { name: 'scheduled', type: 'TEXT' },
        { name: 'completed', type: 'TEXT' },
        { name: 'status', type: 'TEXT' },
        { name: 'isExpanded', type: 'INTEGER' },
    ]
};

export const billsTable: Table = {
    name: "bills",
    cols: [
        { name: 'date', type: 'TEXT' },
        { name: 'content', type: 'TEXT' },
        { name: 'type', type: 'TEXT' },
        { name: 'platform', type: 'TEXT' },
        { name: 'price', type: 'REAL' },
    ]
};

export const reviewTable: Table = {
    name: "reviews",
    cols: [
        { name: "date", type: "TEXT" },
        { name: "mood", type: "TEXT" },
        { name: "summary", type: "TEXT" },
    ]
};

export const storeTable: Table = {
    name: "store",
    cols: [
        { name: "stopwatchState", type: "BLOB" },
        { name: "stopwatch", type: "BLOB" },
        { name: "stopwatchInfo", type: "BLOB" },
        { name: "habits", type: "BLOB" },
        { name: "selectOption", type: "TEXT" },
        { name: "city", type: "TEXT" },
    ]
};

export const overviewTable: Table = {
    name: "overview",
    cols: [
        { name: "year", type: "TEXT" },
        { name: "data", type: "BLOB" },
        { name: "summary", type: "TEXT" }
    ]
}

export const DBTables: Table[] = [tasksTable, billsTable, reviewTable, storeTable, overviewTable];
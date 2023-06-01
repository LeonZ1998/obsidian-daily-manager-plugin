export interface store {
    name: string,
    keyPath: string
}

export const createDatabase = (dbName: string, stores: store[]) => {
    return new Promise<void>((resolve, reject) => {
        const request = window.indexedDB.open(dbName, stores.length ? stores.length : undefined);
        request.onerror = () => {
            reject(request.error);
        };

        request.onsuccess = () => {
            resolve();
        };

        request.onupgradeneeded = () => {
            const db = request.result;
            for (let store of stores) {
                if (!db.objectStoreNames.contains(store.name)) {
                    db.createObjectStore(store.name, { keyPath: store.keyPath });
                }
            }
        };

    });
}

export class IDBUtils {
    private db: IDBDatabase | null;
    private dbName: string;
    private storeName: string;
    private keypath: string;

    constructor(dbName: string, storeName: string, keypath: string) {
        this.db = null;
        this.dbName = dbName;
        this.storeName = storeName;
        this.keypath = keypath;
    }

    public openDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.dbName);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: this.keypath });
                }
            };

            request.onerror = () => {
                reject(new Error("Failed to open database"));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
        });
    }

    public closeDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.dbName);

            request.onerror = () => {
                reject(new Error("Failed to open database"));
            };

            request.onsuccess = () => {
                this.db = request.result;
                this.db.close();
            };
        });
    }

    public deleteDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(this.dbName);

            request.onerror = () => {
                reject(new Error("Failed to delete database"));
            };

            request.onsuccess = () => {
                this.db = null;
                resolve();
            };
        });
    }

    public addData(data: Record<string, unknown>): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const transaction = this.db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.add(data);

            request.onerror = () => {
                console.log(this.storeName);

                reject(new Error("Failed to add data"));
            };

            request.onsuccess = () => {
                resolve();
            };
        });
    }

    public deleteData(keypath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const transaction = this.db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(keypath);

            request.onerror = () => {
                reject(new Error("Failed to delete data"));
            };

            request.onsuccess = () => {
                resolve();
            };
        });
    }

    public getData(keyPath: string): Promise<Record<string, unknown>> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const transaction = this.db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(keyPath);

            request.onerror = () => {
                reject(new Error("Failed to get data"));
            };

            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }

    public putData(data: Record<string, unknown>): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const transaction = this.db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.put(data);

            request.onerror = () => {
                reject(new Error("Failed to get data"));
            };

            request.onsuccess = () => {
                resolve();
            };
        });
    }

    public getAllData(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const transaction = this.db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onerror = () => {
                reject(new Error("Failed to get data"));
            };

            request.onsuccess = () => {
                resolve(request.result);
            };
        })
    }

    public clearData(storeName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }
            const transaction = this.db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onerror = () => {
                reject(new Error("Failed to clear data from object store"));
            };

            request.onsuccess = () => {
                resolve();
            };
        });
    }
}

export const databaseStores: store[] = [
    {
        name: "tasks",
        keyPath: "id",
    },
    {
        name: "bills",
        keyPath: "date",
    }
]

export const TaskIDBUtil = new IDBUtils("localdatabase", "tasks", "id");
export const BillIDBUtil = new IDBUtils("localdatabase", "bills", "date");

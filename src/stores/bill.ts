import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { Bill } from '../types/types'
import { SqlUtil } from '../utils/sql/sql';

export const useBillStore = defineStore("bill", () => {
    const billItem: Ref<Bill[]> = ref([]);

    const addBill = (bill: Bill) => {
        billItem.value.push(bill);
        SqlUtil.insertIntoTable("bills", bill);
    }

    const deleteBill = (deleteBill: Bill) => {
        billItem.value = billItem.value.filter((bill) => bill != deleteBill);
        SqlUtil.deleteFromTable("bills", "date = " + `"${deleteBill.date}"` + " AND " + "content = " + `"${deleteBill.content}"`);
    }

    return {
        billItem,
        addBill,
        deleteBill
    }
});
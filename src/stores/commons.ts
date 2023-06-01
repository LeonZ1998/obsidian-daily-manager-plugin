import { defineStore } from "pinia"
import { ref, Ref } from "vue"
import { SqlUtil } from "../utils/sql/sql";

export const useCommonStore = defineStore("common", () => {
    const selectOption: Ref<string> = ref("");
    const city: Ref<string> = ref("");

    const updateSelectOption = (value: string) => {
        selectOption.value = value;
        SqlUtil.updateTableUncondtionlly("store", "selectOption", value);
    }

    const updateCity = (value: string) => {
        city.value = value;
        SqlUtil.updateTableUncondtionlly("store", "city", value);
    }

    return {
        selectOption,
        updateSelectOption,
        city,
        updateCity,
    }
})
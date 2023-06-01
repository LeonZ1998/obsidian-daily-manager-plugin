import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { DailyReview } from '../types/types'
import { SqlUtil } from '../utils/sql/sql';

export const useReviewStore = defineStore("review", () => {
    const reviews: Ref<DailyReview[]> = ref([]);

    const addDailyReview = (review: DailyReview) => {
        reviews.value.push(review);
        SqlUtil.insertIntoTable("review", review);
    }

    return {
        reviews,
        addDailyReview,
    }
})
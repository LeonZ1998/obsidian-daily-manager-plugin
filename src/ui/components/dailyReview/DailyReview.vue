<template>
    <n-card>
        <template #header>
            Daily Review
        </template>

        <n-input type="textarea" v-model:value="summary" show-count style="height:320px;text-align: justify;">
            <template #suffix>
                <n-icon class="icon" size="25">
                    <RefreshOutlined @click="updateDailyReview" v-if="isUpdateReview" />
                    <FileDownloadDoneRound @click="addDailyReview" v-else />
                </n-icon>
            </template>
        </n-input>

        <template #header-extra>
            <n-date-picker type="date" v-model:formatted-value="today" class="datePicker" :first-day-of-week="0"/>
            <n-select :options="moodOptions" v-model:value="mood" class="select" />
        </template>
    </n-card>
</template>

<script setup lang="ts">
import {
    NCard,
    NSelect,
    NDatePicker,
    NInput,
    NIcon
} from 'naive-ui';
import { FileDownloadDoneRound, RefreshOutlined } from '@vicons/material';
import { onMounted, ref, watch } from 'vue';
import moment from 'moment';
import { DailyReview } from '../../../types/types';
import { useReviewStore } from '../../../stores/index';
import { SqlUtil } from '../../../utils/sql/sql';
import { storeToRefs } from 'pinia';
import { Notice } from 'obsidian';

const today = ref(moment().format('YYYY-MM-DD'));
const mood = ref("common");
const summary = ref("");
const isUpdateReview = ref(false);
const moodOptions = ref([
    {
        label: "🤗",
        value: "very happy"
    },
    {
        label: "😀",
        value: "happy"
    },
    {
        label: "🙂",
        value: "common"
    },
    {
        label: "😔",
        value: "pensive "
    },
    {
        label: "😠",
        value: "angry"
    },
])

const reviewIndex = ref(-1);
onMounted(async () => {
    reviewIndex.value = getReviewIndex();
    watch(() => [storeToRefs(useReviewStore()).reviews.value, today.value], () => {
        reviewIndex.value = getReviewIndex();
    })
})

const getReviewIndex = () => {
    const index = useReviewStore().reviews.findIndex((review) => review.date === today.value);
    if (index >= 0) {
        isUpdateReview.value = true;
        mood.value = useReviewStore().reviews[index].mood;
        summary.value = useReviewStore().reviews[index].summary;
    } else {
        isUpdateReview.value = false;
        mood.value = "common";
        summary.value = "";
    }
    return index;
}

const addDailyReview = () => {
    const review: DailyReview = {
        date: today.value,
        mood: mood.value,
        summary: summary.value
    };
    useReviewStore().$patch((state) => {
        state.reviews.push(review);
        isUpdateReview.value = true;
        SqlUtil.insertIntoTable("reviews", review);
    });
    new Notice("Add daily review success!");
}

const updateDailyReview = () => {
    useReviewStore().$patch((state) => {
        state.reviews[reviewIndex.value].summary = summary.value;
        state.reviews[reviewIndex.value].mood = mood.value;
        SqlUtil.updateDataToTable("reviews", "summary", summary.value, `${today.value}`);
        SqlUtil.updateDataToTable("reviews", "mood", mood.value, `${today.value}`);
    });
    new Notice("Update daily review success!");
}

</script>
<style scoped lang='less'>
.select {
    width: 60px;
}

.datePicker {
    width: 140px;
    padding-right: 5px;
}

.icon:hover {
    cursor: pointer;
    color: cyan;
}
</style>
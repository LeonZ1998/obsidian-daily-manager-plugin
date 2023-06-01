<template>
    <n-card class="card">
        <template #header>
            Add Bill
        </template>
        <template #header-extra>
            <n-button style="float: right;text-align: right;" @click="addBill">
                <template #icon>
                    <add />
                </template>
            </n-button>
        </template>

        <n-space justify="center" vertical>
            <div class="container">
                <label class="label">Date</label>
                <n-date-picker type="date" v-model:formatted-value="today" class="com" :first-day-of-week="0"/>
            </div>
            <div class="container">
                <label class="label">Content</label>
                <n-input class="com" v-model:value="content"></n-input>
            </div>
            <div class="container">
                <label class="label">Price</label>
                <n-input-number class="com" v-model:value="price">
                    <template #prefix>
                        ￥
                    </template>
                </n-input-number>
            </div>
            <div class="container">
                <label class="label">Type</label>
                <n-select :options="PayOptions" v-model:value="type" class="com"></n-select>
            </div>
            <div class="container">
                <label class="label">Platform</label>
                <n-radio-group v-model:value="platform" name="PlatformRadioGroup" class="com">
                    <n-space>
                        <n-radio label="Wechat" value="Wechat" key="Wechat" />
                        <n-radio label="Alipay" value="Alipay" key="Alipay" />
                    </n-space>
                </n-radio-group>
            </div>
        </n-space>
    </n-card>

    <BillList :date="today" />
</template>

<script setup lang="ts">
import BillList from './BillList.vue';
import {
    NCard,
    NButton,
    NDatePicker,
    NSpace,
    NInput,
    NInputNumber,
    NRadio,
    NRadioGroup,
    NSelect
} from 'naive-ui';
import { Add } from '@vicons/ionicons5';
import { ref } from 'vue';
import moment from 'moment';
import type { Bill } from '../../../types/types';
import { useBillStore } from '../../../stores';

const today = ref(moment().format('YYYY-MM-DD'));
const type = ref('');
const content = ref('');
const price = ref(0);
const platform = ref('Wechat');

const PayOptions = [
    {
        label: "Food",
        value: "Food"
    },
    {
        label: "Shopping",
        value: "Shopping"
    },
    {
        label: "Communication",
        value: "Communication"
    },
    {
        label: "Learning",
        value: "Learning"
    },
    {
        label: "Medical",
        value: "Medical"
    },
    {
        label: "Entertainment",
        value: "Entertainment"
    },
    {
        label: "Housing-related",
        value: "Housing-related"
    },
    {
        label: "Other",
        value: "Other"
    }
]

const addBill = () => {
    const bill: Bill = {
        date: today.value,
        type: type.value,
        content: content.value,
        price: price.value,
        platform: platform.value
    };

    content.value = '';
    price.value = 0;
    useBillStore().addBill(bill);
}
</script>
<style scoped lang='less'>
.container {
    width: 100%;
    align-items: center;
    display: flex;

    .label {
        width: 20%;
    }

    .com {
        width: 80%;
    }
}

.card {
    display: flex;
    margin: 0px auto;
    padding: 0;
    width: 95%;
    text-align: left;
}
</style>
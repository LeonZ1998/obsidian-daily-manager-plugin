<template>
  <n-list style="margin: 10px 10px;">
    <n-list-item v-for="bill of bills">
      <n-thing :title="bill.content" content-style="margin-top: 10px;">
        <template #header-extra>
          <n-tag :bordered="false" type="info" size="small">
            {{ bill.type }}
          </n-tag>
          <n-divider vertical />
          {{ bill.price }}
          <n-divider vertical />
          <n-icon :component="Trash" @click="removeBill(bill)" class="trash-icon" />
        </template>
      </n-thing>
    </n-list-item>
    <div class="footer" v-if="totalPayment != 0">
      Total: {{ totalPayment }}
    </div>
  </n-list>
</template>

<script setup lang="ts">
import {
  NList,
  NListItem,
  NIcon,
  NThing,
  NTag,
  NDivider
} from 'naive-ui';
import { Trash } from '@vicons/ionicons5'
import { computed, ref } from 'vue';
import { useBillStore } from '../../../stores';
import { Bill } from '../../../types/types';
import { Notice } from 'obsidian';

const props = defineProps<{ date: string }>();
const totalPayment = ref(0);

const bills = computed(() => {
  const todayBillItems = useBillStore().billItem.filter((bill) => bill.date === props.date);
  totalPayment.value = todayBillItems.reduce((total, current) => total + current.price, 0);
  return todayBillItems;
})

const removeBill = (deleteBill: Bill) => {
  useBillStore().deleteBill(deleteBill);
  new Notice("delete bill success!");
}

</script>
<style scoped lang='less'>
.trash-icon {
  :hover {
    cursor: pointer;
  }
}

.footer {
  text-align: right;
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
}
</style>
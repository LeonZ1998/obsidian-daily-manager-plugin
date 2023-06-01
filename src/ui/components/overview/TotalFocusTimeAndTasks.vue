<template>
  <n-grid cols="1 320:2 640:2" responsive="self">
    <n-grid-item>
      <n-card title="Total Completed Tasks" content-style="font-size: 16px;">
        {{ data[0] }}
      </n-card>
    </n-grid-item>
    <n-grid-item>
      <n-card title="Total Focus Time" content-style="font-size: 16px;">
        {{ data[1] }}
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import {
  NCard,
  NGrid,
  NGridItem,
} from 'naive-ui';

defineProps<{
  data: string[]
}>();

</script>
<style scoped lang='less'></style>
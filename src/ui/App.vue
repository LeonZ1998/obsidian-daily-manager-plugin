<template>
  <div class="daily-manager-app">
    <n-config-provider :theme="theme">
      <div class="nav-bar">
        <n-icon v-for="(item, index) of data" class="icon-class" :component="item.icon" @click="switchPage(item, index)"
          :size="activeIndex === index ? 40 : 30" style="margin: 10px;" />
      </div>
      <div id="body" class="body">
        <component :is="comId"></component>
      </div>
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">
import { useOsTheme, darkTheme, NConfigProvider, NIcon } from 'naive-ui';
import {
  AppsRound,
  AccessAlarmOutlined,
  TaskAltOutlined,
  CommentBankOutlined,
  AddLocationOutlined,
  PreviewOutlined
} from '@vicons/material';
import { computed, markRaw, ref, shallowRef } from 'vue';
import Overview from '../ui/components/Overview.vue';
import ShowStopwatch from '../ui/components/ShowStopwatch.vue';
import ShowTaskItem from '../ui/components/ShowTaskItem.vue';
import ShowBill from '../ui/components/ShowBill.vue';
import ShowHabit from '../ui/components/ShowHabit.vue';
import ShowDailyReview from '../ui/components/ShowDailyReview.vue'

const osThemeRef = useOsTheme();
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null));

const comId = shallowRef(ShowTaskItem);
const activeIndex = ref(0);

const data = [
  {
    icon: TaskAltOutlined,
    com: markRaw(ShowTaskItem),
  },
  {
    icon: AccessAlarmOutlined,
    com: markRaw(ShowStopwatch),
  },
  {
    icon: CommentBankOutlined,
    com: markRaw(ShowBill),
  },
  {
    icon: AddLocationOutlined,
    com: markRaw(ShowHabit),
  },
  {
    icon: PreviewOutlined,
    com: markRaw(ShowDailyReview),
  },
  {
    icon: AppsRound,
    com: markRaw(Overview),
  },
]

const switchPage = (item: any, index: number) => {
  comId.value = item.com;
  activeIndex.value = index;
}

</script>
<style scoped lang='less'>
#daily-manager-app {
  padding: 0px;
  display: flex;
  overflow: hidden;
}

.nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  padding: 0 5px;
  margin-bottom: 5px;
  background-color: #0b0a0a;
  border: 1px #ccc;
}

.body {
  padding: 0px 5px;
  overflow: auto;
}

.icon-class:hover {
  cursor: pointer;
}
</style>
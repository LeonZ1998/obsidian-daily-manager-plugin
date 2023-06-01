<template>
    <n-card>
        <template #header>
            Mood Barchart
        </template>
        <V-chart :option="option" class="chart" />
    </n-card>
</template>

<script setup lang="ts">
import {
    NCard
} from 'naive-ui';
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
    TooltipComponent,
    GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";

use([
    CanvasRenderer,
    BarChart,
    TooltipComponent,
    GridComponent
]);

provide(THEME_KEY, "dark");

const props = defineProps<{
    data: number[]
}>();

const option = ref({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        top:'1%',
        left: '3%',
        right: '4%',
        bottom: '2%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ['😠', '😔', '🙂', '😀', '🤗']
    },
    series: [
        {
            type: 'bar',
            data: props.data
        },
    ]
})
</script>
<style scoped lang='less'>
.chart {
    width: 100%;
    height: 200px;
}
</style>
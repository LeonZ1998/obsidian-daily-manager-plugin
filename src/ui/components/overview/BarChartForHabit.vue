<template>
    <n-card>
        <template #header>
            Habit Barchart
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
    LegendComponent,
    TooltipComponent,
    GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";

use([
    CanvasRenderer,
    BarChart,
    LegendComponent,
    TooltipComponent,
    GridComponent
]);

provide(THEME_KEY, "dark");

const props = defineProps<{
    xAxisData: string[],
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
        top: '3%',
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: props.xAxisData,
            axisTick: {
                alignWithLabel: true,
                interval: 0
            },
            axisLabel: {
                show: true,
            }
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Days',
            type: 'bar',
            barWidth: '50%',
            data: props.data
        }
    ]
});

</script>
<style scoped lang='less'>
.chart {
    width: 100%;
    height: 350px;
}
</style>
<template>
    <n-card>
        <template #header>
            Bill Linechart
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
import { LineChart } from "echarts/charts";
import {
    TooltipComponent,
    GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";

use([
    CanvasRenderer,
    LineChart,
    TooltipComponent,
    GridComponent,
]);

provide(THEME_KEY, "dark");

const props = defineProps<{ data: number[] }>();

const option = ref({
    tooltip: {
        trigger: "item",
        formatter: '{c0}'
    },
    xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: props.data,
            type: 'line',
            itemStyle: {
                borderWith: 4,
            }
        }
    ],
    grid: {
        top: '10%',
        bottom: '10%',
        left: '10%',
        right: '5%'
    }
});


</script>
<style scoped lang='less'>
.chart {
    height: 260px;
}
</style>
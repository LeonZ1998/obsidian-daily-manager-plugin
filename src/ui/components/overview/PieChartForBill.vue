<template>
    <n-card>
        <template #header>
            Bill Piechart
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
import { PieChart } from "echarts/charts";
import {
    LegendComponent,
    TooltipComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";

use([
    CanvasRenderer,
    PieChart,
    LegendComponent,
    TooltipComponent
]);

provide(THEME_KEY, "dark");

const props = defineProps<{ data: { value: number, name: string }[] }>();

const option = ref({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '2%',
        left: '1%',
        orient: 'vertical',
    },
    series: [
        {
            type: 'pie',
            left: '25%',
            radius: ['60%', '95%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 20,
                    fontWeight: 'normal'
                }
            },
            labelLine: {
                show: false
            },
            data: props.data
        }
    ]
});

</script>
<style scoped lang='less'>
.chart {
    height: 260px;
}
</style>
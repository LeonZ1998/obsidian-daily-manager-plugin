<template>
    <n-card>
        <template #header>
            Focustime Heatmap
        </template>
        <V-chart class="chart" :option="heatmapOption" />
    </n-card>
</template>

<script setup lang="ts">
import {
    NCard
} from 'naive-ui';
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { HeatmapChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    VisualMapComponent,
    CalendarComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";
import { formatMilliseconds } from '../../../utils/time';

use([
    CanvasRenderer,
    HeatmapChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    VisualMapComponent,
    CalendarComponent
]);

provide(THEME_KEY, "dark");

const props = defineProps<{
    data: [string, number, number][],
    year: string,
}>();

const heatmapOption = ref({

    tooltip: {
        trigger: "item",
        formatter: function (params: any) {
            return params.value[0] + ", " + formatMilliseconds(params.value[1]);
        }
    },
    visualMap: {
        min: 0,
        max: 4,
        pieces: [
            { value: 0, label: "0m" },
            { value: 1, label: "0-1h" },
            { value: 2, label: "1-3h" },
            { value: 3, label: "3-5h" },
            { value: 4, label: ">5h" },
        ],
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 5,
        inRange: {
            color: ['#343434', '#dae3fe', '#a3b9fd', '#7e9cfc', '#4772fa']
        },
    },
    calendar: {
        top: 60,
        left: 15,
        right: 15,
        cellSize: ['auto', 21],
        range: props.year,
        itemStyle: {
            borderWidth: 2,
            borderColor: "#1e1e1e",
        },
        dayLabel: {
            show: false,
        },
        monthLabel: {
            formatter: '{M}',
        },
        yearLabel: { show: true },
        splitLine: { show: true }
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        encode: {
            value: 1,
        },
        data: props.data,
    }
});

</script>
<style scoped lang='less'>
.chart {
    width: auto;
    height: 230px;
}
</style>
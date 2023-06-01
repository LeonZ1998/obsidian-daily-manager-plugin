<template>
    <n-card title="Weather" style="margin-bottom: 16px" size="small">
        <template #header-extra>
            <n-input v-model:value="city" @keydown.enter="getWeather(city)" style="width:100px"
                placeholder="City with pinyin" />
        </template>
        <n-spin v-show="show"></n-spin>
        <n-alert :show-icon="false" v-show="!show" :bordered="false">
            {{ Weather.weather }}
            <n-divider vertical />
            {{ Weather.temperatureRange }}
            <n-divider vertical />
            {{ Weather.air }}
            <n-divider vertical />
            {{ Weather.pm }}
        </n-alert>
    </n-card>
</template>

<script setup lang="ts">
import {
    NCard,
    NDivider,
    NSpin,
    NAlert,
    NInput
} from 'naive-ui';
import { onMounted, ref } from 'vue';
import { request } from 'obsidian';
import { useCommonStore } from '../../../stores';
import { storeToRefs } from 'pinia';

const show = ref(true);
const city = storeToRefs(useCommonStore()).city;

const Weather = ref({
    weather: '',
    temperatureRange: '',
    air: '',
    pm: ''
});

onMounted(async () => {
    if (city.value != '') {
        getWeather(city.value);
    }
});

const getWeather = async (city: string) => {
    show.value = true;
    useCommonStore().updateCity(city);
    const sUrl = new URL('https://www.tianqi.com/' + city);
    const res = await request({
        url: sUrl.href,
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
    const data = res.replace(/\n/g, '');

    let weather = /<span><b>(.*?)<\/b>(.*?)<\/span>/.exec(res);
    let air = /<dd class="kongqi" ><h5 style="background-color:#[0-9a-z]{6};">(.*?)<\/h5><h6>(.*?)<\/h6><span>(.*?)<br \/>(.*?)<\/span><\/dd>/.exec(data)

    Weather.value.weather = weather != null ? weather[1] : '';
    Weather.value.temperatureRange = weather != null ? weather[2] : '';
    Weather.value.air = air != null ? air[1] : '';
    Weather.value.pm = air != null ? air[2] : '';
    show.value = false;
}

</script>
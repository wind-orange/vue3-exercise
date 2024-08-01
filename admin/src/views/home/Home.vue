<template>
  <div class="part-panel">
    <el-card class="box-card">
      <div slot="header" class="card-title">
        <span>数据概括</span>
      </div>
      <div class="data-list">
        <el-row :gutter="10">
          <el-col :span="4" v-for="item in allDataList">
            <div class="data-item">
              <div class="title">{{ item.statisticsName }}</div>
              <div class="data-panel">
                <div class="data">{{ item.count }}</div>
                <div class="pre">
                  昨日新增：<span class="new">{{ item.preCount }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
  <!-- charts -->
  <div class="part-panel">
    <el-card>
      <div slot="header" class="card-title">
        <span>近一周数据概括</span>
      </div>
      <div class="data-list">
        <el-row :gutter="10">
          <!-- App下载 -->
          <el-col :span="12">
            <div class="chart" ref="myChartsAppWeekDataRef"></div>
          </el-col>
          <!-- 内容统计 -->
          <el-col :span="12">
            <div class="chart" ref="myChartsContentWeekDataRef"></div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, getCurrentInstance, nextTick, shallowRef } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  getAlldata: "/index/getAllData",
  getAppWeekdata: "/index/getAppWeekData",
  getContentWeekdata: "/index/getContentWeekData",
};
// 查询数据概括
const allDataList = ref([]);
// 获取所有数据
const loadAllData = async () => {
  let result = await proxy.Request({
    url: api.getAlldata,
  });
  if (!result) return;
  allDataList.value = result.data;
};
loadAllData();

// charts配置
const getOption = (title, xAxisData = [], seriesData = []) => {
  return {
    title: {
      text: title,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        textStyle: {
          color: "red",
        },
      },
    },
    legend: {
      x: 200,
    },
    grid: {
      left: 50,
      right: 0,
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: "#90979c",
        },
      },
      data: xAxisData,
      axisLabel: {
        interval: 0,
        rotate: "45",
      },
    },
    yAxis: {
      type: "value",
    },
    series: seriesData,
  };
};
// 查询App下载
const myChartsAppWeekDataRef = ref();
const myChartsAppWeekData = shallowRef();
const initAppWeekData = () => {
  nextTick(() => {
    myChartsAppWeekData.value = echarts.init(myChartsAppWeekDataRef.value);
    loadAppWeekData();
  });
};
initAppWeekData();

const loadAppWeekData = async () => {
  let result = await proxy.Request({
    url: api.getAppWeekdata,
  });
  if (!result) {
    return;
  }
  const data = result.data;
  console.log(data);
  const xAxisData = data.dateList;
  const seriesData = [];
  const colors = ["#1b9cfc", "#67c23a"];
  data.itemDataList.forEach((item, index) => {
    seriesData.push({
      name: item.statisticsName,
      type: "bar",
      smooth: true,
      data: item.listData,
      itemStyle: {
        color: colors[index],
      },
    });
  });
  myChartsAppWeekData.value.setOption(
    getOption("App下载注册用户统计", xAxisData, seriesData)
  );
};
// 内容统计
const myChartsContentWeekDataRef = ref();
const myChartsContentWeekData = shallowRef();
const initContentWeekData = () => {
  nextTick(() => {
    myChartsContentWeekData.value = echarts.init(myChartsContentWeekDataRef.value);
    loadContentWeekData();
  });
};
initContentWeekData();

const loadContentWeekData = async () => {
  let result = await proxy.Request({
    url: api.getAppWeekdata,
  });
  if (!result) {
    return;
  }
  const data = result.data;
  console.log(data);
  const xAxisData = data.dateList;
  const seriesData = [];
  const colors = ["#1b9cfc", "#67c23a", "#33166e", "#fb7993", "#a4c4fc"];
  data.itemDataList.forEach((item, index) => {
    seriesData.push({
      name: item.statisticsName,
      type: "bar",
      smooth: true,
      data: item.listData,
      itemStyle: {
        color: colors[index],
      },
    });
  });
  myChartsContentWeekData.value.setOption(
    getOption("App下载注册用户统计", xAxisData, seriesData)
  );
};
</script>

<style lang="scss">
.card-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}
.part-panel {
  margin-top: 10px;
  &:first-child {
    margin-top: 0;
  }
}
.data-list {
  .data-item {
    background: #f4f9fd;
    color: #9a9fa6;
    padding: 20px;
    border-radius: 5px;
    width: 100%;
    .data-panel {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .data {
      font-size: 25px;
      color: #000012;
      font-weight: bold;
      margin-top: 10px;
    }
    .pre {
      margin-top: 5px;
      .new {
        color: #ff6873;
      }
    }
  }
}
.chart {
  height: calc(100vh - 400px);
}
</style>

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
          <el-col :span="12">
            <div class="chart" ref="myCharts4AppWeekDataRef"></div>
          </el-col>
          <el-col :span="12">
            <div class="chart" ref="myCharts4ContentWeekDataRef"></div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup></script>

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

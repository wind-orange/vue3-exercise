<template>
  <!-- 上方搜索框 -->
  <div class="top-panel">
    <el-card>
      <el-form :model="searchForm" label-width="70px" label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="加入日期" label-width="70px">
              <el-date-picker
                v-model="searchForm.createTimeRange"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                @keyup.enter.native="loadDataList"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="最近使用日期" label-width="110px">
              <el-date-picker
                v-model="searchForm.lastTimeRange"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                @keyup.enter.native="loadDataList"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人">
              <el-input
                class="password-input"
                v-model="searchForm.createUserNameFuzzy"
                clearable
                placeholder="支持模糊搜索"
                @keyup.enter="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- btn -->
          <el-col :span="4" :style="{ paddingLeft: '20px' }">
            <el-button type="success" plain @click="loadDataList"
              >查询
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
  <!-- 下方content -->
  <el-card class="table-data-card">
    <Table
      ref="tableInfoRef"
      :columns="columns"
      :fetch="loadDataList"
      :dataSource="tableData"
      :options="tableOptions"
      :extHeight="tableOptions.extHeight"
    >
      <el-col :span="5">
        <el-form-item label="品牌" label-width="40px">
          <el-input
            v-model="searchForm.deviceBrandFuzzy"
            clearable
            palceholder="支持模糊搜索"
            @keyup.enter="loadDataList"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="设备ID" label-width="40px">
          <el-input
            v-model="searchForm.lastUseDeviceId"
            clearable
            palceholder="支持模糊搜索"
            @keyup.enter="loadDataList"
          ></el-input>
        </el-form-item>
      </el-col>
    </Table>
  </el-card>
</template>

<script setup>
import Table from "@/components/Table.vue";
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const api = {
  loadDataList: "/appUser/loadDeviceList",
};
const tableInfoRef = ref();
const tableOptions = ref({});
// Table字段
const columns = [
  {
    label: "登陆设备",
    prop: "deviceId",
  },
  {
    label: "设备品牌",
    prop: "deviceBrand",
  },
  {
    label: "创建时间",
    prop: "createTime",
  },
  {
    label: "最近使用时间",
    prop: "lastUseTime",
  },
  {
    label: "登录IP",
    prop: "ip",
  },
];

// 用户列表
const searchForm = ref({});
const tableData = ref({});
// 获取数据
const loadDataList = async () => {
  let parmas = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(parmas, searchForm.value);
  // 根据时间查询
  if (searchForm.value.createTimeRange) {
    parmas.createTimeStart = searchForm.value.createTimeRange[0];
    parmas.createTimeEnd = searchForm.value.createTimeRange[1];
  }
  if (searchForm.value.lastTimeRange) {
    parmas.lastTimeStart = searchForm.value.lastTimeRange[0];
    parmas.lastTimeEnd = searchForm.value.lastTimeRange[1];
  }
  let result = await proxy.Request({
    url: api.loadDataList,
    parmas: parmas,
  });
  if (!result) return;
  Object.assign(tableData.value, result.data);
};
</script>

<style lang="scss" scoped>
.search {
  padding-bottom: 15px;
}
</style>

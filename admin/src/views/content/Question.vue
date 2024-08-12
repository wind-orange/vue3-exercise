<template>
  <!-- 上方搜索框 -->
  <div class="top-panel">
    <el-card>
      <el-form :model="searchForm" label-width="70px" label-position="right">
        <!-- 搜索框 -->
        <div class="search">
          <el-row>
            <el-col :span="4">
              <el-form-item label="标题" label-width="50px">
                <el-input
                  class="password-input"
                  v-model="searchForm.titleFuzzy"
                  clearable
                  placeholder="支持模糊搜索"
                  @keyup.enter.native="loadDataList"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="分类" label-width="50px">
                <CategorySelect
                  :type="0"
                  v-model="searchForm.categoryId"
                  @change="loadDataList"
                ></CategorySelect>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="难度" label-width="50px">
                <el-select
                  clearable
                  placeholder="请选择难度"
                  v-model="searchForm.difficultyLevel"
                >
                  <el-option :value="1" label="一星"></el-option>
                  <el-option :value="2" label="二星"></el-option>
                  <el-option :value="3" label="三星"></el-option>
                  <el-option :value="4" label="四星"></el-option>
                  <el-option :value="5" label="五星"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="状态" label-width="50px">
                <el-select
                  clearable
                  placeholder="请选择状态"
                  v-model="searchForm.status"
                >
                  <el-option :value="0" label="待发布"></el-option>
                  <el-option :value="1" label="已发布"></el-option>
                </el-select>
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
          </el-row>
        </div>
        <!-- 按钮 -->
        <div class="btn">
          <el-row>
            <el-col :span="16" :style="{ paddingLeft: '10px' }">
              <el-button type="success" plain @click="loadDataList"
                >查询
              </el-button>
              <el-button
                type="primary"
                plain
                @click="showEdit()"
                v-has="proxy.PermissionCode.account.edit"
                >新增问题</el-button
              >
              <el-button
                type="info"
                plain
                @click="showImport()"
                v-has="proxy.PermissionCode.account.edit"
                >批量导入</el-button
              >
              <el-button
                type="warning"
                plain
                @click="showEdit()"
                v-has="proxy.PermissionCode.account.edit"
                >批量发布</el-button
              >
              <el-button
                type="danger"
                plain
                @click="showEdit()"
                v-has="proxy.PermissionCode.account.edit"
                >批量删除</el-button
              >
            </el-col>
          </el-row>
        </div>
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
      <template #slotDifficultyLevel="{ index, row }">
        <el-rate v-model="row.difficultyLevel" :disabled="true"></el-rate>
      </template>
      <template #slotStatus="{ index, row }">
        <Badge showType="orange" text="待发布" v-if="row.status == 0"></Badge>
        <Badge showType="green" text="已发布" v-if="row.status == 1"></Badge>
      </template>
      <template #slotOperation="{ index, row }">
        <div
          class="row-op-panel"
          v-if="!(userInfo.superAdmin && userInfo.userId == row.userId)"
        >
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="showEdit(row)"
            v-has="proxy.PermissionCode.account.edit"
            >修改
          </a>
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="delAccount(row)"
            v-has="proxy.PermissionCode.account.del"
            >取消操作
          </a>
        </div>
      </template>
    </Table>
  </el-card>
  <QuestionEdit ref="questionEditRef" @reload="loadDataList"></QuestionEdit>
  <ImportData ref="importDataRef" :type="0" @reload="loadDataList"></ImportData>
</template>

<script setup>
import QuestionEdit from "@/components/QuestionEdit.vue";
import Table from "@/components/Table.vue";
import CategorySelect from "@/components/content/CategorySelect.vue";
import Badge from "@/components/Budge.vue";
import ImportData from "@/components/content/ImportData.vue";
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const api = {
  loadDataList: "/questionInfo/loadDataList",
  delQuestion: "/questionInfo/delQuestion",
  delQuestionBatch: "/questionInfo/delQuestionBatch",
  postQuestion: "/questionInfo/postQuestion",
  cancelPostQuestion: "/questionInfo/cancelPostQuestion",
};
const tableInfoRef = ref();
const tableOptions = ref({
  selectType: "checkbox",
});
const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
// Table字段
const columns = [
  {
    label: "ID",
    prop: "questionId",
    width: 80,
  },
  {
    label: "标题",
    prop: "title",
    // scopedSlots: "slotTitle",
  },
  {
    label: "分类",
    prop: "categoryName",
    width: "150",
  },
  {
    label: "难度",
    prop: "difficultyLevel",
    width: 130,
    scopedSlots: "slotDifficultyLevel",
  },
  {
    label: "创建人",
    prop: "createUserName",
    width: 150,
  },
  {
    label: "创建时间",
    prop: "createTime",
    width: 150,
  },
  {
    label: "发布状态",
    prop: "status",
    width: 90,
    scopedSlots: "slotStatus",
  },
  {
    label: "操作",
    prop: "operation",
    width: 190,
    scopedSlots: "slotOperation",
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
  // 搜索框
  Object.assign(parmas, searchForm.value);
  let result = await proxy.Request({
    url: api.loadDataList,
    parmas: parmas,
  });
  if (!result) return;
  Object.assign(tableData.value, result.data);
};

// 删除用户
const delAccount = (data) => {
  proxy.Confirm(`确定要删除【${data.userName}】吗？`, async () => {
    let result = await proxy.Request({
      url: api.delAccount,
      parmas: { userId: data.userId },
    });
    if (!result) return;
    proxy.Message.success("删除成功");
    loadDataList();
  });
};

// 新增和修改用户
const questionEditRef = ref();
const showEdit = (data = {}) => {
  questionEditRef.value.showEdit(Object.assign({}, data));
};

// 批量添加
const importDataRef = ref();
const showImport = () => {
  importDataRef.value.showImport();
};
</script>

<style lang="scss" scoped>
.search {
  padding-bottom: 15px;
}
</style>

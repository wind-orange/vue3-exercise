<template>
  <!-- 上方搜索框 -->
  <div class="top-panel">
    <el-card>
      <el-form :model="searchForm" label-width="70px" label-position="right">
        <!-- 搜索框 -->
        <div class="search">
          <el-row>
            <el-col :span="5">
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
            <el-col :span="5">
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
            <el-col :span="5">
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
            <el-col :span="9" :style="{ paddingLeft: '20px' }">
              <el-button type="success" plain @click="loadDataList"
                >查询
              </el-button>
              <el-button
                type="primary"
                plain
                @click="showEdit()"
                v-has="proxy.PermissionCode.share.edit"
                >新增问题</el-button
              >
              <el-button
                type="warning"
                plain
                @click="postQuestionBatch"
                v-has="proxy.PermissionCode.share.post"
                :disabled="selectRowList.length == 0"
                >批量发布</el-button
              >
              <el-button
                type="danger"
                plain
                @click="delQuestionBatch"
                v-has="proxy.PermissionCode.share.del_batch"
                :disabled="selectRowList.length == 0"
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
      :selected="selectedHandler"
      @rowSelected="rowSelected"
    >
      <template #slotCover="{ index, row }">
        <Cover
          v-if="row.coverType == 0"
          title="无封面"
          bgColor="#ddd"
          :width="100"
          :height="100"
        ></Cover>
        <Cover
          v-if="row.coverType == 1"
          :cover="row.coverPath"
          :width="200"
          :height="100"
        ></Cover>
        <Cover
          v-if="row.coverType == 2"
          :cover="row.coverPath"
          :width="100"
          :height="100"
        ></Cover>
      </template>
      <template #slotTitle="{ index, row }">
        <span class="a-link" @click="showDetailHandler(row)">
          {{ row.title }}
        </span>
      </template>
      <template #slotDifficultyLevel="{ index, row }">
        <el-rate v-model="row.difficultyLevel" :disabled="true"></el-rate>
      </template>
      <template #slotStatus="{ index, row }">
        <Badge showType="orange" text="待发布" v-if="row.status == 0"></Badge>
        <Badge showType="green" text="已发布" v-if="row.status == 1"></Badge>
      </template>
      <template #slotOperation="{ index, row }">
        <div class="row-op-panel">
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="showEdit(row)"
            v-has="proxy.PermissionCode.question.edit"
            v-if="
              row.status == 0 &&
              (row.createUserId == userInfo.userId || userInfo.superAdmin)
            "
            >修改
          </a>
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="delQuestion(row)"
            v-has="proxy.PermissionCode.question.del"
            v-if="
              row.status == 0 &&
              (row.createUserId == userInfo.userId || userInfo.superAdmin)
            "
            >删除
          </a>
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="postQuestion(row)"
            v-has="proxy.PermissionCode.question.post"
            v-if="row.status == 0"
            >发布
          </a>
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="cancelPostQuestion(row)"
            v-has="proxy.PermissionCode.question.post"
            v-if="row.status == 1"
            >取消发布
          </a>
        </div>
      </template>
    </Table>
  </el-card>
  <ShareEdit ref="sahreEditRef" @reload="loadDataList"></ShareEdit>
</template>

<script setup>
import ShareEdit from "@/components/ShareEdit.vue";
import Cover from "@/components/Cover.vue";
import Table from "@/components/Table.vue";
import Badge from "@/components/Budge.vue";
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const api = {
  loadDataList: "/shareInfo/loadDataList",
  delShare: "/shareInfo/delShare",
  delShareBatch: "/shareInfo/delShareBatch",
  postShare: "/shareInfo/postShare",
  cancelPostShare: "/shareInfo/cancelPostShare",
};
const tableInfoRef = ref();
const tableOptions = ref({
  selectType: "checkbox",
  extHeight: 172, // 组件最大高度，防止滚动条
});
const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
// Table字段
const columns = [
  {
    label: "ID",
    prop: "shareId",
    width: 80,
  },
  {
    label: "封面",
    prop: "cover",
    scopedSlots: "slotCover",
    width: 220,
  },
  {
    label: "标题",
    prop: "title",
    scopedSlots: "slotTitle",
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

// 新增和修改用户
const sahreEditRef = ref();
const showEdit = (data = {}) => {
  sahreEditRef.value.showEdit(Object.assign({}, data));
};

// 可以选中的条件
const selectedHandler = (row, index) => {
  return row.status == 0;
};
// 已经选中
const selectRowList = ref([]);
const rowSelected = (rows) => {
  selectRowList.value = rows.map((item) => {
    return item.shareId;
  });
};

// 删除
const delQuestionDone = async (parmas, url) => {
  let result = await proxy.Request({
    url: url,
    parmas: parmas,
  });
  if (!result) return;
  proxy.Message.success("删除成功");
  loadDataList();
};
// 单个删除
const delQuestion = (data) => {
  proxy.Confirm(`确定要删除【${data.title}】吗？`, () => {
    delQuestionDone({ shareId: data.shareId }, api.delShare);
  });
};
// 批量删除
const delQuestionBatch = () => {
  proxy.Confirm(`确定要删除这${selectRowList.value.length}条记录吗？`, () => {
    delQuestionDone(
      { sahreIds: selectRowList.value.join(",") },
      api.delShareBatch
    );
  });
};

// 发布
const postQuestionDown = async (shareIds) => {
  let result = await proxy.Request({
    url: api.postShare,
    parmas: { shareIds },
  });
  if (!result) return;
  proxy.Message.success("发布成功");
  loadDataList();
};
// 单个发布
const postQuestion = (data) => {
  proxy.Confirm(`确定要发布【${data.title}】吗？`, () => {
    postQuestionDown(data.shareId);
  });
};
// 批量发布
const postQuestionBatch = () => {
  proxy.Confirm(`确定要发布这${selectRowList.value.length}条记录吗？`, () => {
    postQuestionDown(selectRowList.value.join(","));
  });
};

// 取消发布
const cancelPostQuestion = (data) => {
  proxy.Confirm(`确定要取消发布【${data.title}】吗？`, async () => {
    let result = await proxy.Request({
      url: api.cancelPostShare,
      parmas: { shareIds: data.shareId },
    });
    if (!result) return;
    proxy.Message.success("取消发布成功");
    loadDataList();
  });
};
</script>

<style lang="scss" scoped>
.search {
  padding-bottom: 15px;
}
</style>

<template>
  <!-- 上方搜索框 -->
  <div class="top-panel">
    <el-card>
      <el-form :model="searchForm" label-width="70px" label-position="right">
        <!-- 搜索框 -->
        <div class="search">
          <el-row>
            <el-col :span="3">
              <el-form-item label="标题" label-width="45px">
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
            <el-col :span="5">
              <el-form-item label="问题类型" label-width="80px">
                <el-select
                  clearable
                  placeholder="请选择问题类型"
                  v-model="searchForm.questionType"
                >
                  <el-option
                    :value="item.value"
                    :label="item.text"
                    v-for="item in questionTypeList"
                  ></el-option>
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
            <el-col :span="4">
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
                v-has="proxy.PermissionCode.question.edit"
                >新增问题</el-button
              >
              <el-button
                type="info"
                plain
                @click="showImport()"
                v-has="proxy.PermissionCode.question.import"
                >批量导入</el-button
              >
              <el-button
                type="warning"
                plain
                @click="postQuestionBatch"
                v-has="proxy.PermissionCode.question.post"
                :disabled="selectRowList.length == 0"
                >批量发布</el-button
              >
              <el-button
                type="danger"
                plain
                @click="delQuestionBatch"
                v-has="proxy.PermissionCode.question.del_batch"
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
      <template #slotTitle="{ index, row }">
        <span class="a-link" @click="showDetailHandler(row)">
          {{ row.title }}
        </span>
      </template>
      <template #slotQuestionType="{ index, row }">
        {{ QUESTION_TYPE[row.questionType] }}
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
  <ExamEdit ref="examEditRef" @reload="loadDataList"></ExamEdit>
  <ImportData ref="importDataRef" :type="1" @reload="loadDataList"></ImportData>
  <ShowDetail ref="showDetailRef" :showType="2"></ShowDetail>
</template>

<script setup>
import { QUESTION_TYPE } from "@/utils/Constans";
import ExamEdit from "@/components/ExamEdit.vue";
import Table from "@/components/Table.vue";
import CategorySelect from "@/components/content/CategorySelect.vue";
import Badge from "@/components/Budge.vue";
import ImportData from "@/components/content/ImportData.vue";
import ShowDetail from "@/components/content/ShowDetail.vue";
import { computed, getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const api = {
  loadDataList: "/examQuestion/loadDataList",
  delExamQuestion: "/examQuestion/delExamQuestion",
  delExamQuestionBatch: "/examQuestion/delExamQuestionBatch",
  postExamQuestion: "/examQuestion/postExamQuestion",
  cancelPostExamQuestion: "/examQuestion/cancelPostExamQuestion",
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
    prop: "questionId",
    width: 80,
  },
  {
    label: "标题",
    prop: "title",
    scopedSlots: "slotTitle",
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
    label: "问题类型",
    prop: "questionType",
    width: 130,
    scopedSlots: "slotQuestionType",
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
// 把常量从map对象转换成数组
const questionTypeList = computed(() => {
  const questionTypeArray = [];
  for (let item in QUESTION_TYPE) {
    questionTypeArray.push({
      value: item,
      text: QUESTION_TYPE[item],
    });
  }
  return questionTypeArray;
});

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
const examEditRef = ref();
const showEdit = (data = {}) => {
  examEditRef.value.showEdit(Object.assign({}, data));
};

// 批量导入
const importDataRef = ref();
const showImport = () => {
  importDataRef.value.showImport();
};

// 可以选中的条件
const selectedHandler = (row, index) => {
  return row.status == 0;
};
// 已经选中
const selectRowList = ref([]);
const rowSelected = (rows) => {
  selectRowList.value = rows.map((item) => {
    return item.questionId;
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
    delQuestionDone({ questionId: data.questionId }, api.delExamQuestion);
  });
};
// 批量删除
const delQuestionBatch = () => {
  proxy.Confirm(`确定要删除这${selectRowList.value.length}条记录吗？`, () => {
    delQuestionDone(
      { questionIds: selectRowList.value.join(",") },
      api.delExamQuestionBatch
    );
  });
};

// 发布
const postQuestionDown = async (questionIds) => {
  let result = await proxy.Request({
    url: api.postExamQuestion,
    parmas: { questionIds },
  });
  if (!result) return;
  proxy.Message.success("发布成功");
  loadDataList();
};
// 单个发布
const postQuestion = (data) => {
  proxy.Confirm(`确定要发布【${data.title}】吗？`, () => {
    postQuestionDown(data.questionId);
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
      url: api.cancelPostExamQuestion,
      parmas: { questionIds: data.questionId },
    });
    if (!result) return;
    proxy.Message.success("发布成功");
    loadDataList();
  });
};

// 详情
const showDetailRef = ref();
const showDetailHandler = (data) => {
  showDetailRef.value.showDetail(data.questionId, searchForm.value);
};
</script>

<style lang="scss" scoped>
.search {
  padding-bottom: 15px;
}
</style>

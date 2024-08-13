<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    :showCancel="true"
    @close="dialogConfig.show = false"
    width="90%"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="80px"
      @submit.prevent
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="标题" prop="title">
            <el-input :maxLength="10" v-model="formData.title"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="categoryId">
            <CategorySelect
              :type="0"
              v-model="formData.categoryId"
            ></CategorySelect>
          </el-form-item>
          <el-form-item label="难度" prop="difficultyLevel">
            <el-rate v-model="formData.difficultyLevel"></el-rate>
          </el-form-item>
          <el-form-item label="问题类型" prop="questionType">
            <el-radio-group
              v-model="formData.questionType"
              @change="resetAnswer"
            >
              <el-radio :value="item.value" v-for="item in questionTypeList">
                {{ item.text }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 问题选项 -->
          <el-form-item label="答案选项" v-if="formData.questionType != 0">
            <div
              class="question-item"
              v-for="(item, index) in formData.questionItemList"
            >
              <div class="letter">{{ LETTER[index] }}</div>
              <div class="title">
                <el-form-item
                  label-width="0px"
                  :key="index"
                  :prop="'questionItemList.' + index + '.title'"
                  :rules="{
                    required: true,
                    message: '答案选项不能为空',
                  }"
                >
                  <el-input
                    clearable
                    placeholder="请输入答案选项"
                    v-model="item.title"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="op">
                <span
                  class="iconfont icon-add"
                  @click="addQuestionItem"
                  v-if="index == 0"
                ></span>
                <span
                  class="iconfont icon-reduce"
                  @click="reduceQuestionItem(index)"
                  v-else
                ></span>
              </div>
            </div>
          </el-form-item>
          <!-- 答案 -->
          <el-form-item label="答案" prop="questionAnswer">
            <!-- 判断题 -->
            <template v-if="currentQuestionType == 0">
              <el-radio-group v-model="formData.questionAnswer">
                <el-radio value="1">正确</el-radio>
                <el-radio value="0">错误</el-radio>
              </el-radio-group>
            </template>
            <!-- 单选题 -->
            <template v-if="currentQuestionType == 1">
              <el-radio-group v-model="formData.questionAnswer">
                <el-radio
                  :value="index + ''"
                  v-for="(item, index) in formData.questionItemList"
                >
                  {{ LETTER[index] }}
                </el-radio>
              </el-radio-group>
            </template>
            <!-- 多选题 -->
            <template v-if="currentQuestionType == 2">
              <el-checkbox-group v-model="formData.questionAnswer">
                <el-checkbox
                  :value="index + ''"
                  v-for="(item, index) in formData.questionItemList"
                >
                  {{ LETTER[index] }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题描述" prop="content">
            <SunEditor v-model="formData.question" :height="150"></SunEditor>
          </el-form-item>
          <el-form-item label="答案解析" prop="answerAnalysis">
            <SunEditor
              v-model="formData.answerAnalysis"
              :height="150"
            ></SunEditor>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </Dialog>
</template>

<script setup>
import Dialog from "./Dialog.vue";
import CategorySelect from "@/components/content/CategorySelect.vue";
import SunEditor from "@/components/SunEditor.vue";
import { LETTER, QUESTION_TYPE } from "@/utils/Constans";
import { ref, getCurrentInstance, nextTick, computed } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  saveExamQuestion: "/examQuestion/saveExamQuestion",
  loadQuestionItem: "/examQuestion/loadQuestionItem",
};
const dialogConfig = ref({
  show: false,
  title: "新增问题",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});
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
// 切换问题类型
const currentQuestionType = ref(0);
const resetAnswer = (e) => {
  if (e == 2) {
    formData.value.questionAnswer = [];
  } else {
    formData.value.questionAnswer = undefined;
  }
  currentQuestionType.value = e;
};

// 表单配置
const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入标题" }],
  categoryId: [{ required: true, message: "请选择分类" }],
  difficultyLevel: [{ required: true, message: "请选择难度" }],
  questionType: [{ required: true, message: "请选择问题类型" }],
  questionAnswer: [{ required: true, message: "请选择答案" }],
  answerAnalysis: [{ required: true, message: "请输入答案解析" }],
};
// 对外方法
const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = Object.assign({}, data);
    //
    if (formData.value.questionItemList == null) {
      formData.value.questionItemList = [{ title: "", sort: 1 }];
    }
  });
};
defineExpose({ showEdit });

// 添加/删除答案选项框
const addQuestionItem = () => {
  if (formData.value.questionItemList.length >= 26) {
    proxy.Message.success("最多可以添加26个选项");
    return;
  }
  formData.value.questionItemList.push({
    title: "",
    sort: formData.value.questionItemList.length + 1,
  });
};
const reduceQuestionItem = (index) => {
  formData.value.questionItemList.splice(index, 1);
};

const emit = defineEmits(["reload"]);
// 表单提交
const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let parmas = {};
    Object.assign(parmas, formData.value);
    // 选项重复校验
    if (isRepeat(parmas.questionItemList)) {
      proxy.Message.warning("选项重复");
      return;
    }
    // 提交时转换后台对应数据格式
    if (parmas.questionType == 2) {
      parmas.questionAnswer = parmas.questionAnswer.sort().join(",");
    }
    // 非判断题：Json格式
    if (parmas.questionType != 0) {
      parmas.questionItemListJson = JSON.stringify(parmas.questionItemList);
    }
    delete parmas.questionItemList;
    // 发请求
    let result = await proxy.Request({
      url: api.saveExamQuestion,
      parmas,
    });
    if (!result) return;
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功");
    emit("reload");
  });
};

// 选项重复校验方法
const isRepeat = (arr) => {
  let tempMap = {};
  for (let i in arr) {
    if (tempMap[arr[i].title]) {
      return true;
    }
    tempMap[arr[i].title] = true;
  }
  return false;
};
</script>

<style lang="scss" scoped>
.question-item {
  width: 100%;
  display: flex;
  .letter {
    width: 20px;
  }
  .title {
    flex: 1;
    .el-form-item {
      margin-bottom: 18px;
    }
  }
  .op {
    width: 100px;
    overflow: hidden;
    .iconfont {
      margin: 0px 10px;
      cursor: pointer;
    }
  }
}
</style>

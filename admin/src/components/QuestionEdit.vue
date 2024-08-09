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
        </el-col>
        <el-col :span="6">
          <el-form-item label="分类" prop="categoryId">
            <CategorySelect
              :type="0"
              v-model="formData.categoryId"
             
            ></CategorySelect>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="难度" prop="difficultyLevel">
            <el-rate v-model="formData.difficultyLevel"></el-rate>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="问题" prop="content">
            <SunEditor v-model="formData.question"></SunEditor>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="答案解析" prop="answerAnalysis">
            <SunEditor v-model="formData.answerAnalysis"></SunEditor>
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
import { ref, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  saveQuestion: "/questionInfo/saveQuestionInfo",
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

// 表单配置
const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入标题" }],
  categoryId: [{ required: true, message: "请选择分类" }],
  difficultyLevel: [{ required: true, message: "请选择难度" }],
};
// 对外方法
const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = Object.assign({}, data || {});
  });
};
defineExpose({ showEdit });

const emit = defineEmits(["reload"]);
// 表单提交
const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let parmas = {};
    Object.assign(parmas, formData.value);
    let result = await proxy.Request({
      url: api.saveQuestion,
      parmas,
    });
    if (!result) return;
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功");
    emit("reload");
  });
};
</script>

<style lang="scss" scoped></style>

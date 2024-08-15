<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    :showCancel="true"
    @close="dialogConfig.show = false"
    width="60%"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="80px"
      @submit.prevent
    >
      <el-form-item label="标题" prop="title">
        <el-input :maxLength="10" v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item label="封面类型" prop="coverType">
        <el-radio-group v-model="formData.coverType">
          <el-radio :value="0">无封面</el-radio>
          <el-radio :value="1">横幅</el-radio>
          <el-radio :value="2">图标</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="封面"
        prop="coverPath"
        v-if="formData.coverType && coverType != 0"
      >
        <CoverUpload
          v-if="formData.coverType == 1"
          v-model="formData.coverPath"
          :width="330"
          :height="180"
          :type="2"
        ></CoverUpload>
        <CoverUpload
          v-if="formData.coverType == 2"
          v-model="formData.coverPath"
          :width="100"
          :height="100"
          :type="3"
        ></CoverUpload>
      </el-form-item>
      <el-form-item label="分享内容" prop="content">
        <SunEditor v-model="formData.content"></SunEditor>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import Dialog from "./Dialog.vue";
import SunEditor from "@/components/SunEditor.vue";
import CoverUpload from "./CoverUpload.vue";
import { ref, getCurrentInstance, nextTick } from "vue";

const { proxy } = getCurrentInstance();
const api = {
  saveShare: "/shareInfo/saveShareInfo",
};
const dialogConfig = ref({
  show: false,
  title: "编辑",
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
      url: api.saveShare,
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

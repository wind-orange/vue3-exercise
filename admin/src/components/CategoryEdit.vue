<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    :showCancel="true"
    @close="dialogConfig.show = false"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="80px"
      @submit.prevent
    >
      <el-form-item label="分类名称" prop="categoryName">
        <el-input :maxLength="10" v-model="formData.categoryName"></el-input>
      </el-form-item>
      <!-- 单选 -->
      <el-form-item label="封面类型" prop="coverType">
        <el-radio-group v-model="formData.coverType">
          <el-radio :value="0">背景颜色</el-radio>
          <el-radio :value="1">图片</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="背景颜色"
        prop="bgColor"
        v-if="formData.coverType == 0"
      >
        <el-color-picker v-model="formData.bgColor" />
      </el-form-item>
      <el-form-item
        label="图片封面"
        prop="iconPath"
        v-if="formData.coverType == 1"
      >
        <CoverUpload v-model="formData.iconPath" :type="0"></CoverUpload>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :value="0">问题分类</el-radio>
          <el-radio :value="1">考题分类</el-radio>
          <el-radio :value="2">问题/考题分类</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import Dialog from "./Dialog.vue";
import CoverUpload from "./CoverUpload.vue";
import { ref, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  saveCategory: "/category/saveCategory",
};
const dialogConfig = ref({
  show: false,
  title: "新增分类",
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
  categoryName: [{ required: true, message: "请输入分类名称" }],
  type: [{ required: true, message: "请选择类型" }],
  coverType: [{ required: true, message: "封面类型" }],
  iconPath: [{ required: true, message: "请上传封面" }],
  bgColor: [{ required: true, message: "请选择背景颜色" }],
};
// 对外方法
const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (data.categoryId == null) {
      dialogConfig.value.title = "新增分类";
      formData.value = {};
    } else {
      dialogConfig.value.title = "修改分类";
      if (data.bgColor != null && data.bgColor != "") {
        data.coverType = 0;
      } else if (data.iconPath != null && data.iconPath != "") {
        data.coverType = 1;
      }
      formData.value = Object.assign({}, data);
    }
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
    if (parmas.coverType == 0) {
      parmas.iconPath = "";
    } else {
      parmas.bgColor = "";
    }
    let result = await proxy.Request({
      url: api.saveCategory,
      parmas,
    });
    if (!result) {
      return;
    }
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功");
    emit("reload");
  });
};
</script>

<style lang="scss" scoped></style>

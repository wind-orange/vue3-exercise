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
      <el-form-item label="用户名">
        {{ formData.userName }}
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input :maxLength="20" v-model="formData.password"></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="rePassword">
        <el-input
          :maxLength="20"
          v-model="formData.rePassword"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import Dialog from "./Dialog.vue";
import { ref, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  updatePassword: "/settings/updatePassword",
};
const dialogConfig = ref({
  show: false,
  title: "修改密码",
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

// 验证密码
const checkPassword = (rule, value, callback) => {
  if (value !== formData.value.password) {
    callback(new Error(rule.message));
  } else {
    callback;
  }
};
// 表单配置
const formData = ref({});
const formDataRef = ref();
const rules = {
  password: [
    { required: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: "密码最少八位，只能是数字，字母和特殊字符",
    },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码" },
    {
      validator: checkPassword,
      message: "两次输入的密码不一致",
    },
  ],
};
// 对外方法
const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {
      userName: data.userName,
      userId: data.userId,
    };
  });
};
defineExpose({ showEdit });

// 表单提交
const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let parmas = {};
    Object.assign(parmas, formData.value);
    let result = await proxy.Request({
      url: api.updatePassword,
      parmas,
    });
    if (!result) return;
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功");
  });
};
</script>

<style lang="scss" scoped>
</style>

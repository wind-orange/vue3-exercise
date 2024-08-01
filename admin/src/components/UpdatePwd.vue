<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="false"
      width="400px"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <!-- input密码框 -->
        <el-form-item label="新密码" prop="password">
          <el-input
            type="password"
            size="large"
            placeholder="请输入新密码"
            v-model.trim="formData.password"
          >
            <template #prefix>
              <span class="iconfont icon-Safety"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 确认密码框 -->
        <el-form-item label="确认密码" prop="rePassword">
          <el-input
            type="password"
            size="large"
            placeholder="请再次输入密码"
            v-model.trim="formData.rePassword"
          >
            <template #prefix>
              <span class="iconfont icon-Safety"></span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import Dialog from "./Dialog.vue";
import { ref, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  updateMyPwd: "/updateMyPwd",
};
const dialogConfig = ref({
  show: false,
  title: "修改密码",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        save();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  password: [
    { required: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: "密码只能是数字,字母,特殊字符8-18位",
    },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码" },
    {
      validator: checkPassword(),
      message: "两次输入的密码不一致",
    },
  ],
};
// 调用
const show = () => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {};
  });
};
defineExpose({ show });
// 保存
const save = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let parmas = {};
    Object.assign(parmas, formData.value);
    let result = await proxy.Request({
      url: api.updateMyPwd,
      parmas,
    });
    if (!result) return;
    proxy.Message.success("密码修改成功");
    dialogConfig.value.show = false;
  });
};
</script>

<style></style>

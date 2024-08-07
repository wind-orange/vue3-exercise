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
      <el-form-item label="用户名" prop="userName">
        <el-input :maxLength="20" v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="phone">
        <el-input :maxLength="11" v-model="formData.phone"></el-input>
      </el-form-item>
      <template v-if="!formData.userId">
        <el-form-item label="密码" prop="password">
          <el-input
            :maxLength="20"
            v-model="formData.password"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="rePassword">
          <el-input
            :maxLength="20"
            v-model="formData.rePassword"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
      </template>
      <el-form-item label="职位" prop="position">
        <el-input :maxLength="20" v-model="formData.position"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roles">
        <el-checkbox-group v-model="formData.roles">
          <span
            class="check-span-item"
            v-for="(item, index) in roleList"
            :key="index"
          >
            <el-checkbox :value="`${item.roleId}`">
              {{ item.roleName }}
            </el-checkbox>
          </span>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import Dialog from "./Dialog.vue";
import { ref, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadAllRoles: "/settings/loadAllRoles",
  saveAccount: "/settings/saveAccount",
};
const dialogConfig = ref({
  show: false,
  title: "新增账号",
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

// 获取角色列表
const roleList = ref([]);
const loadRoleList = async () => {
  let result = await proxy.Request({
    url: api.loadAllRoles,
  });
  if (!result) return;
  roleList.value = result.data;
};
loadRoleList();

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
  userName: [{ required: true, message: "请输入用户名" }],
  phone: [
    { required: true, message: "请输入账号" },
    {
      validator: proxy.Verify.phone,
      trigger: "blur",
      message: "请输入正确的账号",
    },
  ],
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
      validator: checkPassword(),
      message: "两次输入的密码不一致",
    },
  ],
  roles: [{ required: true, message: "请选择角色" }],
};
// 对外方法
const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (data.userId == null) {
      dialogConfig.value.title = "新增账号";
      formData.value = { roles: [] };
    } else {
      dialogConfig.value.title = "修改账号";
      let editData = Object.assign({}, data);
      editData.roles = editData.roles.split(","); // 将后台角色数据分隔成数组
      formData.value = Object.assign({}, editData);
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
    parmas.roles = parmas.roles.join(","); // 数组->字符串
    delete parmas.createTime;
    let result = await proxy.Request({
      url: api.saveAccount,
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

<style lang="scss" scoped>
.check-span-item {
  float: left;
  margin-right: 10px;
  line-height: 20px;
}
</style>

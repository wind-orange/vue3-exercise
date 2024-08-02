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
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          clearable
          placeholder="提示信息"
          v-model.trim="formData.menuName"
        ></el-input
      ></el-form-item>
      <el-form-item label="父级菜单" prop="pId" v-if="formData.pId != 0">
        <el-tree-select
          clearable
          placeholder="请选择父级菜单"
          v-model="formData.pId"
          :data="treeData"
          :props="treeProps"
          defaultExpandAll
          node-key="menuId"
          show-search
          style="width: 100%"
          :check-strictly="true"
        ></el-tree-select>
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="formData.menuType">
          <el-radio value="0">菜单</el-radio>
          <el-radio value="1">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="请求路径"
        prop="menuUrl"
        v-if="formData.menuType == 0"
      >
        <el-input
          clearable
          placeholder="eg:/settings/user"
          v-model.trim="formData.menuUrl"
          :maxLength="50"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限编码" prop="permissionCode">
        <el-input
          clearable
          v-model.trim="formData.permissionCode"
          :maxLength="50"
        ></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input
          clearable
          placeholder="eg:home"
          v-model.trim="formData.icon"
          :maxLength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input
          clearable
          placeholder="eg:home"
          v-model.trim="formData.sort"
          :maxLength="10"
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
  saveMenu: "settings/saveMenu",
};
const props = defineProps({
  treeData: {
    type: Array,
    default: [],
  },
});
const treeProps = {
  label: "menuName",
  children: "children",
  class: "custom-tree-item",
  value: "menuId",
};
const dialogConfig = ref({
  show: false,
  title: "标题",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitform();
      },
    },
  ],
});

// 表单
const formData = ref({});
const formDataRef = ref();
const rules = {
  menuName: [{ required: true, message: "请输入名称" }],
  pId: [{ required: true, message: "请输入父级菜单" }],
  menuType: [{ required: true, message: "请输入菜单类型" }],
  menuUrl: [{ required: true, message: "请输入菜单路径" }],
  permissionCode: [{ required: true, message: "请输入权限编码" }],
  sort: [
    {
      required: true,
      message: "请输入排序号",
    },
    {
      validator: proxy.Verify.number,
      trigger: "blur",
      message: "请输入正确的排序号",
    },
  ],
};
// 表单校验
const emit = defineEmits(["reload"]);
const submitform = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let parmas = {};
    Object.assign(parmas, formData.value);
    delete parmas.children;
    let result = await proxy.Request({
      url: api.saveMenu,
      parmas,
    });
    if (!result) return;
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功");
    emit("reload");
  });
};

// 对外方法
const showEditDialog = (type, data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (type == "edit") {
      dialogConfig.value.title = "修改菜单";
      formData.value = Object.assign({}, data);
    } else {
      dialogConfig.value.title = "新增菜单";
      formData.value = { pId: data.menuId };
    }
  });
};
defineExpose({ showEditDialog });
</script>

<style></style>

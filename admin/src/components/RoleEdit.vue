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
      <el-form-item label="角色名称" prop="roleName">
        <el-input :maxLength="20" v-model="formData.roleName"></el-input>
      </el-form-item>
      <el-form-item label="关联菜单" prop="menuIds" v-if="!formData.roleId">
        <div class="tree-panel">
          <el-tree
            ref="menuTreeRef"
            node-key="menuId"
            show-checkbox
            :data="treeData"
            default-expand-all
            :props="replaceFields"
            @check-change="handleMenuTreeChecked"
          ></el-tree>
        </div>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input
          type="textarea"
          :maxLength="250"
          v-model="formData.roleDesc"
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
  saveRole: "/settings/saveRole",
};
const props = defineProps({
  treeData: {
    type: Array,
    default: [],
  },
});
const replaceFields = ref({
  label: "menuName",
});
const dialogConfig = ref({
  show: false,
  title: "新增角色",
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
  roleName: [{ required: true, message: "请输入角色名称" }],
  menuId: [{ required: true, message: "请选择菜单", trigger: ["change"] }],
};
// 对外方法
const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    data.menuIds = [];
    dialogConfig.value.title = data.menuId ? "修改角色" : "新增角色";
    formDataRef.value.resetFields();
    formData.value = data;
  });
};
defineExpose({ showEdit });

const menuTreeRef = ref();
// 勾选菜单后更新数据，否则无法提交
const handleMenuTreeChecked = () => {
  formData.value.menuIds = menuTreeRef.value.getCheckedKeys();
};

const emit = defineEmits(["reload"]);
// 表单提交
const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let parmas = {};
    Object.assign(parmas, formData.value);
    if (parmas.roleId) {
      // 修改：不能改菜单
      parmas.menuIds = null;
    } else {
      // 新增
      parmas.menuIds = parmas.menuIds.join(",");
      let halfMenuIdArray = menuTreeRef.value.getHalfCheckedKeys();
      parmas.halfMenuIds = halfMenuIdArray.join(",");
    }
    let result = await proxy.Request({
      url: api.saveRole,
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
.tree-panel {
  width: 100%;
  max-height: calc(100vh / 2);
  overflow: auto;
}
</style>

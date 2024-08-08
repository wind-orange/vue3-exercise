<template>
  <!-- 上方搜索框 -->
  <div class="top-panel">
    <el-card>
      <!-- 搜索框 -->
      <el-form :model="searchForm" label-width="70px" label-position="right">
        <el-button
          type="primary"
          @click="showEdit()"
          v-has="proxy.PermissionCode.category.edit"
          >新增分类
        </el-button>
      </el-form>
    </el-card>
  </div>
  <!-- 下方content -->
  <el-card class="table-data-card">
    <template #header>
      <span>角色列表</span>
    </template>
    <Table
      ref="tableInfoRef"
      :columns="columns"
      :fetch="loadDataList"
      :dataSource="tableData"
      :options="tableOptions"
      :extHeight="tableOptions.extHeight"
      :show-pagination="false"
    >
      <template #iconPathSlot="{ index, row }">
        <Cover
          :cover="row.iconPath"
          :bgColor="row.bgColor"
          :title="row.categoryName"
        ></Cover>
      </template>
      <template #typeSlot="{ index, row }">
        <span v-if="row.type == 0">问题分类</span>
        <span v-if="row.type == 1">考题分类</span>
        <span v-if="row.type == 2">问题/考题分类</span>
      </template>
      <template #slotOperation="{ index, row }">
        <div
          class="row-op-panel"
          v-if="!(userInfo.superAdmin && userInfo.userId == row.userId)"
        >
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="showEdit(row)"
            v-has="proxy.PermissionCode.category.edit"
            >修改
          </a>
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="delAccount(row)"
            v-has="proxy.PermissionCode.category.del"
            >删除
          </a>
          <a
            :class="[index == 0 ? 'not-allow' : 'a-link']"
            href="javascript:void(0)"
            @click="delAccount(row)"
            v-has="proxy.PermissionCode.category.edit"
            >上移
          </a>
          <a
            :class="[
              index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
            ]"
            href="javascript:void(0)"
            @click="delAccount(row)"
            v-has="proxy.PermissionCode.category.edit"
            >下移
          </a>
        </div>
      </template>
    </Table>
  </el-card>
  <UserEdit ref="userEditRef" @reload="loadDataList"></UserEdit>
</template>

<script setup>
import Table from "@/components/Table.vue";
import UserEdit from "@/components/UserEdit.vue";
import Cover from "@/components/Cover.vue";
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const api = {
  loadCategory: "/category/loadAllCategory",
  saveCategory: "/category/saveCategory",
  delCategory: "/category/delCategory",
  changeSort: "/category/changeSort",
};
const tableInfoRef = ref();
const tableOptions = ref({
  extHeight: 125,
});
const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
// Table字段
const columns = [
  {
    label: "封面",
    prop: "iconPath",
    scopedSlots: "iconPathSlot",
    width: 150,
  },
  {
    label: "分类名称",
    prop: "categoryName",
  },
  {
    label: "类型",
    prop: "type",
    scopedSlots: "typeSlot",
  },
  {
    label: "操作",
    prop: "type",
    scopedSlots: "slotOperation",
    width: 200,
  },
];

// 用户列表
const searchForm = ref({});
const tableData = ref({});
// 获取数据
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadCategory,
  });
  if (!result) return;
  tableData.value.list = result.data;
};

// 删除用户
const delAccount = (data) => {
  proxy.Confirm(`确定要删除【${data.userName}】吗？`, async () => {
    let result = await proxy.Request({
      url: api.delAccount,
      parmas: { userId: data.userId },
    });
    if (!result) return;
    proxy.Message.success("删除成功");
    loadDataList();
  });
};
// 禁用启用
const changeAccountStatus = (data) => {
  let status = data.status == 0 ? 1 : 0;
  let info = status == 0 ? "禁用" : "启用";
  proxy.Confirm(`确定要【${info}】【${data.userName}】吗？`, async () => {
    let result = await proxy.Request({
      url: api.updateStatus,
      parmas: { userId: data.userId, status: status },
    });
    if (!result) return;
    proxy.Message.success("操作成功");
    loadDataList();
  });
};

// 新增和修改用户
const userEditRef = ref();
const showEdit = (data = {}) => {
  userEditRef.value.showEdit(Object.assign({}, data));
};
// 修改密码
const userRef = ref();
const showPwdEdit = (data = {}) => {
  userRef.value.showEdit(Object.assign({}, data));
};
</script>

<style lang="scss" scoped></style>

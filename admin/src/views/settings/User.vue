<template>
  <!-- 上方搜索框 -->
  <div class="top-panel">
    <el-card>
      <!-- 搜索框 -->
      <el-form :model="searchForm" label-width="70px" label-position="right">
        <el-row>
          <el-col :span="5">
            <el-form-item label="用户名">
              <el-input
                class="password-input"
                v-model="searchForm.userNameFuzzy"
                clearable
                placeholder="支持模糊搜索"
                @keyup.enter.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="账号">
              <el-input
                class="password-input"
                v-model="searchForm.phoneFuzzy"
                clearable
                placeholder="支持模糊搜索"
                @keyup.enter.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="{ paddingLeft: '10px' }">
            <el-button type="success" @click="loadDataList">查询</el-button>
            <el-button
              type="primary"
              @click="showEdit()"
              v-has="proxy.PermissionCode.account.edit"
              >新增用户</el-button
            >
          </el-col>
        </el-row>
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
    >
      <template #slotStatus="{ index, row }">
        <span style="color: red" v-if="row.status == 0">禁用</span>
        <span style="color: green" v-else>启用</span>
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
            v-has="proxy.PermissionCode.account.edit"
            >修改
          </a>
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="showPwdEdit(row)"
            v-has="proxy.PermissionCode.account.updatePwd"
            >修改密码
          </a>
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="changeAccountStatus(row)"
            v-has="proxy.PermissionCode.account.updateStatus"
            >{{ row.status == 0 ? "启用" : "禁用" }}
          </a>
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="delAccount(row)"
            v-has="proxy.PermissionCode.account.del"
            >删除
          </a>
        </div>
      </template>
    </Table>
  </el-card>
  <UserEdit ref="userEditRef" @reload="loadDataList"></UserEdit>
  <UserPwdEdit ref="userRef"></UserPwdEdit>
</template>

<script setup>
import Table from "@/components/Table.vue";
import UserEdit from "@/components/UserEdit.vue";
import UserPwdEdit from "@/components/UserPwdEdit.vue";
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const api = {
  loadDataList: "/settings/loadAccountList",
  delAccount: "/settings/delAccount",
  updateStatus: "/settings/updateStatus",
};
const tableInfoRef = ref();
const tableOptions = ref({
  extHeight: 125,
});
const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
// Table字段
const columns = [
  {
    label: "用户名",
    prop: "userName",
    width: 150,
  },
  {
    label: "账号",
    prop: "phone",
    width: 200,
  },
  {
    label: "拥有角色",
    prop: "roleNames",
  },
  {
    label: "创建时间",
    prop: "createTime",
    width: 200,
  },
  {
    label: "状态",
    prop: "status",
    width: 100,
    scopedSlots: "slotStatus",
  },
  {
    label: "操作",
    prop: "operation",
    width: 190,
    scopedSlots: "slotOperation",
  },
];

// 用户列表
const searchForm = ref({});
const tableData = ref({});
// 获取数据
const loadDataList = async () => {
  let parmas = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  // 搜索框
  Object.assign(parmas, searchForm.value);
  let result = await proxy.Request({
    url: api.loadDataList,
    parmas: parmas,
  });
  if (!result) return;
  Object.assign(tableData.value, result.data);
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

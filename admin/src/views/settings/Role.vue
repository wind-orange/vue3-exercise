<template>
  <!-- 上方搜索框 -->
  <div class="top-panel">
    <el-card>
      <el-form :model="searchForm" label-width="70px" label-position="right">
        <!-- 搜索框 -->
        <el-row>
          <el-col :span="5">
            <el-form-item label="角色名称">
              <el-input
                class="password-input"
                clearable
                placeholder="支持模糊搜索"
                @keyup.enter.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="描述">
              <el-input
                class="password-input"
                clearable
                placeholder="支持模糊搜索"
                @keyup.enter.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="{ paddingLeft: '10px' }">
            <el-button type="success" @click="">查询</el-button>
            <el-button type="primary" @click="">新增角色</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
  <!-- 下方content -->
  <el-row
    :gutter="20"
    :style="{ 'margin-top': '10px' }"
    class="tabel-data-card"
  >
    <!-- 左侧角色列表 -->
    <el-col :span="18">
      <el-card class="box-card">
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
          @row-click="handleRowClick"
        >
          <template #operation="{ index, row }">
            <div class="row-op-panel">
              <a class="a-link" href="javascript:void(0)">修改 </a>
              <a class="a-link" href="javascript:void(0)">删除 </a>
            </div>
          </template>
        </Table>
      </el-card>
    </el-col>
    <!-- 右侧菜单栏 -->
    <el-col :span="6">
      <el-card class="box-card">
        <template #header>
          <span>菜单信息</span>
          <el-button type="primary" :style="{ float: 'right' }" @click=""
            >保存
          </el-button>
        </template>
        <div class="detail-tree-panel">
          <el-tree
            ref="menuTreeRef"
            node-key="menuId"
            show-checkbox
            :data="treeData"
            default-expand-all
            v-if="treeData.length"
            :props="replaceFields"
            :check-strictly="false"
          />
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import Table from "@/components/Table.vue";
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const api = {
  loadRole: "/settings/loadRoles",
  loadMenu: "/settings/menuList",
  delRole: "/settings/delRole",
  saveRoleMenu: "/settings/saveRoleMenu",
  roleDetail: "/settings/getRoleByRoleId",
};
const tableInfoRef = ref();
const tableOptions = ref({
  extHeight: 125,
});
// Table字段
const columns = [
  {
    label: "角色名称",
    prop: "roleName",
  },
  {
    label: "描述",
    prop: "roleDesc",
  },
  {
    label: "创建时间",
    prop: "createTime",
  },
  {
    width: 100,
    label: "操作",
    scopedSlots: "operation",
  },
];

// 角色列表
const searchForm = ref();
const tableData = ref({});
const currentRow = ref({}); // 当前选中的行
// 获取数据
const loadDataList = async () => {
  let parmas = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  // 搜索框
  Object.assign(parmas, searchForm.value);
  let result = await proxy.Request({
    url: api.loadRole,
    parmas: parmas,
  });
  if (!result) return;
  Object.assign(tableData.value, result.data);
  // 默认选中第一个
  if (
    Object.keys(currentRow.value).length === 0 &&
    result.data.list.length > 0
  ) {
    Object.assign(currentRow.value, result.data.list[0]);
    handleRowClick(currentRow.value);
  }
  tableInfoRef.value.setCurrentRow("roleId", currentRow.value.roleId);
};

// 菜单
const replaceFields = ref({ label: "menuName" });
const menuTreeRef = ref();
const treeData = ref([]);
// 获取数据
const loadMenu = async () => {
  let result = await proxy.Request({
    url: api.loadMenu,
  });
  if (!result) return;
  treeData.value = result.data;
};
loadMenu();
// 选中列表渲染相应菜单
const handleRowClick = async (row) => {
  Object.assign(currentRow.value, row);
  let result = await proxy.Request({
    url: api.roleDetail,
    parmas: { roleId: row.roleId },
  });
  if (!result) return;
  menuTreeRef.value.setCheckedKeys(result.data.menuIds);
};
</script>

<style lang="scss" scoped>
.detail-tree-panel {
  height: calc(100vh - 273px);
  overflow: auto;
  width: 100%;
}
</style>

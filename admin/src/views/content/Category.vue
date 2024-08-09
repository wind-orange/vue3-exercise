<template>
  <!-- 上方搜索框 -->
  <div class="top-panel">
    <el-card>
      <!-- 搜索框 -->
      <el-form label-width="70px" label-position="right">
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
        <div class="row-op-panel">
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
            @click="delCategory(row)"
            v-has="proxy.PermissionCode.category.del"
            >删除
          </a>
          <a
            :class="[index == 0 ? 'not-allow' : 'a-link']"
            href="javascript:void(0)"
            @click="changeSort(index, 'up')"
            v-has="proxy.PermissionCode.category.edit"
            >上移
          </a>
          <a
            :class="[
              index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
            ]"
            href="javascript:void(0)"
            @click="changeSort(index, 'down')"
            v-has="proxy.PermissionCode.category.edit"
            >下移
          </a>
        </div>
      </template>
    </Table>
  </el-card>
  <CategoryEdit ref="categoryEditRef" @reload="loadDataList"></CategoryEdit>
</template>

<script setup>
import Table from "@/components/Table.vue";
import CategoryEdit from "@/components/CategoryEdit.vue";
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
const delCategory = (data) => {
  proxy.Confirm(`确定要删除【${data.categoryName}】吗？`, async () => {
    let result = await proxy.Request({
      url: api.delCategory,
      parmas: { categoryId: data.categoryId },
    });
    if (!result) return;
    proxy.Message.success("删除成功");
    loadDataList();
  });
};

// 排序
const changeSort = async (index, type) => {
  let dataList = tableData.value.list;
  if (
    (type === "down" && index == dataList.length - 1) ||
    (type === "up" && index == 0)
  ) {
    return;
  }
  let temp = dataList[index];
  let number = type === "down" ? 1 : -1;
  dataList.splice(index, 1);
  dataList.splice(index + number, 0, temp);
  let categoryIds = [];
  dataList.forEach((element) => {
    categoryIds.push(element.categoryId);
  });
  let result = await proxy.Request({
    url: api.changeSort,
    parmas: { categoryIds: categoryIds.join(",") },
  });
  if (!result) return;
  proxy.Message.success("排序成功")
  loadDataList()
};

// 新增分类、修改
const categoryEditRef = ref();
const showEdit = (data = {}) => {
    categoryEditRef.value.showEdit(Object.assign({}, data));
};
</script>

<style lang="scss" scoped></style>

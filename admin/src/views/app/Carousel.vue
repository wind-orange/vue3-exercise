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
          >新增轮播图
        </el-button>
      </el-form>
    </el-card>
  </div>
  <!-- 下方content -->
  <el-card class="table-data-card">
    <Table
      ref="tableInfoRef"
      :columns="columns"
      :fetch="loadDataList"
      :dataSource="tableData"
      :options="tableOptions"
      :extHeight="tableOptions.extHeight"
      :show-pagination="false"
    >
      <template #slotImgPath="{ index, row }">
        <Cover :cover="row.imgPath" :width="330" :height="180"></Cover>
      </template>
      <template #slotObjectType="{ index, row }">
        {{ OBJECT_TYPE_MAP[row.objectType] }}
      </template>
      <template #slotObject="{ index, row }">
        <div v-if="row.objectType == 3">{{ row.outerLink }}</div>
        <div v-else>{{ row.objectId }}</div>
      </template>
      <template #slotOperation="{ index, row }">
        <div class="row-op-panel">
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="showEdit(row)"
            v-has="proxy.PermissionCode.app.app_carousel_edit"
            >修改
          </a>
          <a
            class="a-link"
            href="javascript:void(0)"
            @click="delCarousel(row)"
            v-has="proxy.PermissionCode.app.app_carousel_edit"
            >删除
          </a>
          <a
            :class="[index == 0 ? 'not-allow' : 'a-link']"
            href="javascript:void(0)"
            @click="changeSort(index, 'up')"
            v-has="proxy.PermissionCode.app.app_carousel_edit"
            >上移
          </a>
          <a
            :class="[
              index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
            ]"
            href="javascript:void(0)"
            @click="changeSort(index, 'down')"
            v-has="proxy.PermissionCode.app.app_carousel_edit"
            >下移
          </a>
        </div>
      </template>
    </Table>
  </el-card>
  <CarouselEdit ref="CarouselEditRef" @reload="loadDataList"></CarouselEdit>
</template>

<script setup>
import { OBJECT_TYPE_MAP } from "@/utils/Constans";
import Table from "@/components/Table.vue";
import CarouselEdit from "@/components/CarouselEdit.vue";
import Cover from "@/components/Cover.vue";
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const api = {
  loadDataList: "/appCarousel/loadDataList",
  saveCarousel: "/appCarousel/saveCarousel",
  delCarousel: "/appCarousel/delCarousel",
  changeSort: "/appCarousel/changeSort",
};
const tableInfoRef = ref();
const tableOptions = ref({
  extHeight: 85,
});
// Table字段
const columns = [
  {
    label: "轮播图",
    prop: "imgPath",
    scopedSlots: "slotImgPath",
    width: 150,
  },
  {
    label: "类型",
    prop: "objectType",
    scopedSlots: "slotObjectType",
  },
  {
    label: "主体ID/链接",
    prop: "object",
    scopedSlots: "slotObject",
  },
  {
    label: "操作",
    prop: "operation",
    scopedSlots: "slotOperation",
    width: 200,
  },
];

const tableData = ref({});
// 获取数据
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadDataList,
  });
  if (!result) return;
  tableData.value.list = result.data;
};

// 删除用户
const delCarousel = (data) => {
  proxy.Confirm(`确定要删除吗？`, async () => {
    let result = await proxy.Request({
      url: api.delCarousel,
      parmas: { carouselId: data.carouselId },
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
  let carouselIds = [];
  dataList.forEach((element) => {
    carouselIds.push(element.carouselId);
  });
  let result = await proxy.Request({
    url: api.changeSort,
    parmas: { carouselIds: carouselIds.join(",") },
  });
  if (!result) return;
  proxy.Message.success("排序成功");
  loadDataList();
};

// 新增分类、修改
const CarouselEditRef = ref();
const showEdit = (data = {}) => {
  CarouselEditRef.value.showEdit(Object.assign({}, data));
};
</script>

<style lang="scss" scoped></style>

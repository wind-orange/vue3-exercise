<template>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="60%"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <Table
        :columns="columns"
        :initFetch="false"
        :dataSource="tableData"
        :options="tableOptions"
        :showPagination="false"
      >
        <template #slotErrorItem="{ index, row }">
          <div class="error-list">
            <div class="item" v-for="(item, num) in row.errorItemList">
              {{ num + 1 }}、{{ item }}
            </div>
          </div>
        </template>
      </Table>
    </Dialog>
</template>

<script setup>
import Dialog from "../Dialog.vue";
import Table from "../Table.vue";
import { getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();
const dialogConfig = ref({
  show: false,
  title: "错误信息",
  buttons: [
    {
      type: "primary",
      text: "关闭",
      click: (e) => {
        dialogConfig.value.show = false;
      },
    },
  ],
});
const columns = [
  {
    label: "错误行",
    prop: "rowNum",
    width: 100,
  },
  {
    label: "错误信息",
    prop: "errorItemList",
    scopedSlots: "slotErrorItem",
  },
];
const tableData = ref({});
const tableOptions = {
  exHeight: 20,
};

// 对外方法
const showData = (data) => {
  dialogConfig.value.show = true;
  tableData.value.list = data;
};
defineExpose({ showData });
</script>

<style></style>

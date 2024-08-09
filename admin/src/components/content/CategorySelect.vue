<template>
  <!-- 分类：下拉框 -->
  <el-select
    clearable
    placeholder="请选择分类"
    :modelValue="modelValue"
    @change="onChange"
    style="width: 100%"
  >
    <el-option
      :value="item.categoryId"
      :label="item.categoryName"
      v-for="item in categoryList"
    ></el-option>
  </el-select>
</template>

<script setup>
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();
const api = {
  loadCategory: "/category/loadAllCategory4Select",
};
const props = defineProps({
  modelValue: { type: [Number, String] },
  type: { type: Number },
});

// 获取数据
const categoryList = ref([]);
const loadCategory = async () => {
  let result = await proxy.Request({
    url: api.loadCategory,
    parmas: { type: props.type },
  });
  if (!result) return;
  categoryList.value = result.data;
};
loadCategory();

// 自定义事件
const emit = defineEmits(["update:modelValue", "change"]);
const onChange = (e) => {
  emit("update:modelValue", e);
  emit("change");
};
</script>

<style></style>

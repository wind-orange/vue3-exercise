<template>
  <div class="my-budge">
    <div class="budge" :style="{ background: showType }"></div>
    <div class="text">{{ text }}</div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
  showType: { type: String },
  text: { type: String },
});
</script>

<style lang="scss" scoped>
.my-budge {
  display: flex;
  align-items: center;
  .budge {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
  }
  .text {
    margin-left: 5px;
  }
}
</style>

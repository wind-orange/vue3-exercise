<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    :showCancel="false"
    @close="dialogConfig.show = false"
  >
    <div class="step">1.下载导入模板</div>
    <div class="content">
      <a
        class="a-link"
        :href="`/api/file/downloadTemplate?type=${type}`"
        target="_blank"
      >
        <span class="iconfont icon-download">下载模板</span>
      </a>
    </div>
    <div class="step">2.选择需要导入的文件</div>
    <div class="content">
      <el-upload
        name="file"
        :show-file-list="false"
        accept=".xlsx"
        :multiple="false"
        :http-request="importData"
      >
        <el-button type="primary">
          <span class="iconfont icon-upload"></span>上传
        </el-button>
      </el-upload>
      <div class="tips">支持xlsx文件</div>
    </div>
  </Dialog>
  <ImportErrorData ref="importErrorDataRef"></ImportErrorData>
</template>

<script setup>
import Dialog from "../Dialog.vue";
import ImportErrorData from "./ImportErrorData.vue";
import { getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  0: "questionInfo/importQuestion",
  1: "examQuestion/importExamQuestion",
};
const props = defineProps({
  type: { type: Number },
});
const dialogConfig = ref({
  show: false,
  title: "导入数据",
});

// 对外方法
const showImport = () => {
  dialogConfig.value.show = true;
};
defineExpose({ showImport });

const emit = defineEmits(["reload"]);
const importErrorDataRef = ref();
const importData = async (file) => {
  let result = await proxy.Request({
    url: api[props.type],
    parmas: { file: file.file },
  });
  if (!result) return;
  if (result.data.length > 0) {
    importErrorDataRef.value.showData(result.data);
  } else {
    proxy.Message.success("导入成功");
    dialogConfig.value.show = false;
    emit("reload");
  }
};
</script>

<style lang="scss" scoped>
.content {
  margin: 15px 0px;
  display: flex;
  align-items: center;
  font-size: 14px;
  .tips {
    margin-left: 10px;
    font-size: 14px;
    color: #878787;
  }
  .iconfont {
    margin-right: 5px;
    font-size: 14px;
  }
}
</style>

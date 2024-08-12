<template>
  <Window :show="showWindow" @close="closeWindow">
    <div class="show-detail">
      <div class="iconfont icon-arrow-left" @click="nextAndPre(-1)"></div>
      <div class="content-info">
        <div class="header"></div>
        <div class="content"></div>
      </div>
      <div class="iconfont icon-arrow-right" @click="nextAndPre(1)"></div>
    </div>
  </Window>
</template>

<script setup>
import Window from "../Window.vue";
import { getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  showType1: "questionInfo/showQuestionDetailNext",
  showType2: "examQuestion/showExamQuestionDetailNext",
  showType3: "shareInfo/showShareDetailNext",
};
const props = defineProps({
  showType: { type: Number, default: 1 },
});
// 控制窗口显示
const showWindow = ref(false);
const closeWindow = () => {
  showWindow.value = false;
  window.removeEventListener("keyup", keyHandler, false); // 关闭窗口时移除监听事件
};

// 对外方法
const showDetail = (id,parmas) => {
  showWindow.value = true;
  searchParmas.value = parmas;
  currentId.value = id;
  nextType.value = null; // 初始化
  getDetail();
  window.addEventListener("keyup", keyHandler, false); // 添加监听事件
};
defineExpose({ showDetail });

const searchParmas = ref({}); // 搜索条件
const currentId = ref(); // 当前展示的id
const nextType = ref(); // 决定前进、后退状态
// 请求数据
const detailInfo = ref({});
const getDetail = async () => {
  const parmas = Object.assign({}, searchParmas.value);
  parmas.nextType = nextType.value;
  parmas.currentId = currentId.value;
  let result = await proxy.Request({
    url: api["showType" + props.showType],
    parmas: parmas,
  });
  if (!result) return;
  let resultData = result.data;
  detailInfo.value = resultData;
  if (props.showType == 3) {
    currentId.value = resultData.shareId;
  } else {
    currentId.value = resultData.questionId;
  }
};
// 前进、后退事件
const nextAndPre = (type) => {
  nextType.value = type;
  getDetail();
};
// 键盘监听事件
const keyHandler = (event) => {
  const e =
    event || window.event || arguments.callee.caller.arguments[0];
  let key = e.keyCode;
  if (key == 39) {
    nextAndPre(1);
  } else if (key == 37) {
    nextAndPre(-1);
  }
};
</script>

<style lang="scss" scoped>
.show-detail {
  height: calc(100vh);
  display: flex;
  justify-content: center;
  align-items: center;
  .content-info {
    width: 405px;
    height: 810px;
    background: url(../../assets/phone.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    background-color: #fff;
    background-position-x: -4px;
    border-radius: 70px;
    padding: 52px 16px 35px 19px;
    .header {
      background: #dad9d9;
      font-size: 18px;
      line-height: 30px;
      text-align: center;
      border-radius: 5px 5px 0px 0px;
    }
    .content {
      height: 730px;
      overflow: auto;
      padding: 10px;
      .title {
        font-weight: bold;
        font-size: 15px;
      }
      .detail-info {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #878787;
        justify-content: space-between;
        .dif {
          display: flex;
          align-items: center;
        }
      }
      .part-title {
        margin-top: 10px;
        font-weight: bold;
        border-left: 3px solid #02baf8;
        padding-left: 5px;
      }
      .html-content {
        margin-top: 10px;
        :deep(code) {
          word-break: break-all;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
        :deep(img) {
          max-width: 100%;
        }
      }
      .question-item-list {
        margin-top: 10px;
        padding-left: 10px;
        .question-item {
          margin-top: 5px;
        }
      }
    }
  }
  .iconfont {
    font-size: 50px;
    color: #97def6;
    cursor: pointer;
  }
  .icon-arrow-left {
    margin-right: 20px;
  }
  .icon-arrow-right {
    margin-left: 20px;
  }
}
</style>

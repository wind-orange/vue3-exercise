<template>
  <div class="menu-tree">
    <el-row :gutter="10">
      <!-- 左侧菜单列表 -->
      <el-col :span="7">
        <el-card class="box-card">
          <!-- 卡头 -->
          <template #header>
            <div class="card-header">
              <span>菜单列表</span>
            </div>
          </template>
          <!-- 树形控件列表 -->
          <el-tree
            class="tree-panel"
            ref="refTree"
            :data="treeData"
            default-expand-all
            node-key="menuId"
            :expand-on-click-node="false"
            :props="treeProps"
            :hightlight-current="true"
            @node-click="nodeClick"
          >
            <template #default="{ node, data }">
              <span class="custom-node-style">
                <span class="node-title">{{ data.menuName }}</span>
              </span>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <!-- 右侧菜单详情 -->
      <el-col :span="17">
        <el-card class="box-card">
          <!-- 卡头 -->
          <template #header>
            <div class="card-header">
              <span>菜单详情</span>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadMenu: "settings/menuList",
  delMenu: "settings/delMenu",
};
const refTree = ref();
const treeProps = {
  label: "menuName",
  children: "children",
  class: "custom-tree-item",
  value: "menuId",
};
const treeData = ref();
const nodeClick = () => {};
const currentNodeKey = ref() // 当前node
// 请求数据
const loadTreeData = async()=>{
  let result = await proxy.Request({
    url:api.loadMenu
  })
  if(!result) return
  const data = result.data
  treeData.value = data
}
loadTreeData()
</script>

<style lang="scss" scoped>
.menu-tree {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .iconfont {
      color: #409eff;
      font-size: 20px;
      cursor: pointer;
    }
  }
  .tree-panel {
    overflow: auto;
    height: calc(100vh - 220px);
  }
  :deep(.el-tree-node__content) {
    height: 40px;
  }
  .custom-node-style {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
  }
}
</style>

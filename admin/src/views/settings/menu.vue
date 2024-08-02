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
            :highlight-current="true"
            @node-click="nodeClick"
          >
            <template #default="{ node, data }">
              <span class="custom-node-style">
                <span class="node-title">{{ data.menuName }}</span>
                <el-dropdown trigger="click">
                  <span class="iconfont icon-direction-down"></span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="showEditDialog('add', data)"
                        >添加子菜单
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="showEditDialog('edit', data)"
                        v-if="data.pId !== -1"
                        >修改
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="delMenu(data)"
                        v-if="data.pId !== -1"
                        >删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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
          <!-- form详情 -->
          <el-form class="detail-form" :model="detailData" label-width="100px">
            <el-form-item label="菜单ID:">{{ detailData.menuId }}</el-form-item>
            <el-form-item label="菜单名称:">{{
              detailData.menuName
            }}</el-form-item>
            <el-form-item label="菜单层级:">
              <el-breadcrumb
                separator-class="el-icon-arrow-right"
                :style="{ 'line-height': '40px' }"
              >
                <el-breadcrumb-item
                  v-for="(item, index) in detailData.menuNames"
                  :key="index"
                  >{{ item }}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </el-form-item>
            <el-form-item label="菜单类型:">{{
              detailData.menuType == 0 ? "菜单" : "按钮"
            }}</el-form-item>
            <el-form-item label="菜单路径:">{{
              detailData.menuUrl ? detailData.menuUrl : "-"
            }}</el-form-item>
            <el-form-item label="菜单编码:">{{
              detailData.permissionCode
            }}</el-form-item>
            <el-form-item label="菜单图标:">
              <span
                :class="'iconfont icon-' + detailData.icon"
                v-if="detailData.icon"
              ></span>
              <span v-else>-</span>
            </el-form-item>
            <el-form-item label="排序号:">{{ detailData.sort }}</el-form-item>
          </el-form>
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
const treeProps = {
  label: "menuName",
  children: "children",
  class: "custom-tree-item",
  value: "menuId",
};
const refTree = ref();
const currentNodeKey = ref(); // 当前node

// 请求左侧菜单列表数据
const treeData = ref();
const loadTreeData = async () => {
  let result = await proxy.Request({
    url: api.loadMenu,
  });
  if (!result) return;
  const data = result.data;
  treeData.value = data;
  // 默认选中第一个
  nextTick(() => {
    let firstNodeKey = data[0].children ? data[0].children[0] : data[0];
    let curKey = firstNodeKey.menuId;
    refTree.value.setCurrentKey(curKey);
    const curNode = refTree.value.getNode(curKey);
    nodeClick(curNode.data, curNode);
  });
};
loadTreeData();
// 请求右侧菜单详情数据
const detailData = ref({});
const nodeClick = (data, node) => {
  let menuNames = [];
  getMenuNames(node, menuNames);
  data.menuNames = menuNames;
  Object.assign(detailData.value, data);
};
// 递归获取menuName
const getMenuNames = (node, menuNames) => {
  if (node.data.menuName) {
    menuNames.unshift(node.data.menuName);
  }
  if (node.parent) {
    getMenuNames(node.parent, menuNames);
  }
};
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

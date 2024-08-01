<template>
  <div>
    <div class="menu-tree">
      <el-row :gutter="10">
        <!-- 左侧菜单列表 -->
        <el-col :span="7">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>菜单管理</span>
              </div>
            </template>
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
                  <el-dropdown trigger="click">
                    <span class="iconfont icon-choice"></span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="showEditDialog('add', data)"
                          >添加子菜单</el-dropdown-item
                        >
                        <el-dropdown-item
                          @click="showEditDialog('edit', data)"
                          v-if="data.pId !== -1"
                          >修改</el-dropdown-item
                        >
                        <el-dropdown-item
                          @click="delMenu(data)"
                          v-if="data.pId !== -1"
                          >删除</el-dropdown-item
                        >
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
            <template #header>
              <div class="card-header">
                <span>菜单管理</span>
              </div>
            </template>
            <el-form
              class="detail-form"
              :model="detailData"
              label-width="100px"
            >
              <el-form-item label="菜单ID:">{{
                detailData.menuId
              }}</el-form-item>
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
                  >
                    {{ item }}
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </el-form-item>
              <el-form-item label="菜单类型:">{{
                detailData.menuType == 0 ? "菜单" : "按钮"
              }}</el-form-item>
              <el-form-item label="请求路径:">{{
                detailData.menuUrl ? detailData.menuUrl : "-"
              }}</el-form-item>
              <el-form-item label="权限编码:">{{
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
  </div>
</template>

<script setup></script>

<style lang="scss">
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

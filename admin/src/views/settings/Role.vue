<template>
  <div class="top-panel">
    <el-card>
      <el-form label-width="70px" label-position="right">
        <!-- 搜索框 -->
        <el-row>
          <el-col :span="5">
            <el-form-item label="角色名称">
              <el-input
                class="password-input"
                clearable
                placeholder="支持模糊搜索"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="描述">
              <el-input
                class="password-input"
                clearable
                placeholder="支持模糊搜索"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="{ paddingLeft: '10px' }">
            <el-button type="success">查询</el-button>
            <el-button type="primary">新增角色</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 下方content -->
    <el-row
      :gutter="20"
      :style="{ 'margin-top': '10px' }"
      class="tabel-data-card"
    >
      <!-- 左侧角色列表 -->
      <el-col :span="18">
        <el-card class="box-card">
          <template #header>
            <span>角色列表</span>
          </template>
        </el-card>
      </el-col>
      <!-- 右侧菜单栏 -->
      <el-col :span="6">
        <el-card class="box-card">
          <template #header>
            <span>菜单信息</span>
            <el-button
              type="primary"
              :style="{ float: 'right' }"
              >保存
            </el-button>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.detail-tree-panel {
  height: calc(100vh - 273px);
  overflow: auto;
  width: 100%;
}
</style>

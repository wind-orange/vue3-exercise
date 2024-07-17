<template>
  <div class="layout">
    <div class="header">
      <div class="logo">Exercise管理后台</div>
      <div class="userInfo">欢迎回来</div>
    </div>
    <div class="body">
      <div class="left-sider">
        <div class="menu-list"></div>
        <div class="menu-sub-list"></div>
      </div>
      <div class="main-content">
        <div class="tab-content"></div>
        <div class="body-content"></div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style>
.layout {
  .header {
    display: flex;
    justify-content: space-between;
    position: relative;
    border-bottom: 1px solid #ddd;
    height: 60px;
    padding-right: 24px;
    align-items: center;
    .logo {
      font-weight: bold;
      margin-left: 5px;
      font-size: 25px;
      color: #05a1f5;
    }
    .userinfo {
      margin-right: 20px;
      font-size: 14px;
      display: flex;
      align-items: center;
    }
  }
  .body {
    display: flex;
    .left-sider {
      display: flex;
      width: 260px;
      height: calc(100vh - 60px);
      border-right: 1px solid #f1f2f4;
      box-shadow: 0 3px 10px 0 rgba(14, 14, 14, 0.06);
      .menu-list {
        width: 70px;
        text-align: center;
        background: #1a1a1a;
      }
      .menu-sub-list {
        flex: 1;
        position: relative;
        padding: 5px 5px;
      }
    }
    .main-content {
      width: 100%;
      .tab-content {
        :deep(.el-tabs--border-card) {
          border: none;
        }
        :deep(.el-tabs__content) {
          display: none;
        }
      }
      .body-content {
        padding: 10px;
      }
    }
  }
}
</style>

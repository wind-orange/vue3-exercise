<template>
  <div class="layout">
    <div class="header">
      <div class="logo">Exercise管理后台</div>
      <div class="userinfo">
        欢迎回来，
        <el-dropdown>
          <span class="name">{{ userInfo.userName }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="updateMyPwd">修改密码</el-dropdown-item>
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="body">
      <div class="left-sider">
        <div class="menu-list">
          <div
            :class="['menu-item',currentPmenu.menuUrl == item.menuUrl ? 'active' : '']"
            v-for="item in userInfo.menuList"
            @click="pMenuClickHander(item)"
          >
            <div :class="['iconfont', 'icon-' + item.icon]"></div>
            <div class="menu-name">{{ item.menuName }}</div>
          </div>
        </div>
        <div class="menu-sub-list">
          <div
            :class="['sub-menu',currentSubMenu.menuUrl == sub.menuUrl ? 'active' : '']"
            v-for="sub in currentPmenu.children"
            @click="jump(sub)"
          >
            {{ sub.menuName }}
          </div>
        </div>
      </div>
      <div class="main-content">
        <div class="tab-content"></div>
        <div class="body-content">
          <Router-view></Router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, onMounted, ref } from "vue";
const userInfo = ref(JSON.parse(sessionStorage.getItem("userInfo")) || { menuList: [] })
const currentPmenu = ref({})
const currentSubMenu = ref({})

const updateMyPwd = () => {}
const logout = () => {}
const jump = () => {}
</script>

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
      .name {
        font-size: 1;
        color: #049eff;
        cursor: pointer;
      }
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
        .menu-item {
          padding: 15px 0;
          cursor: pointer;
          color: #fff;
          .iconfont {
            font-size: 20px;
          }
          .menu-name {
            font-weight: bold;
          }
          &:hover {
            color: #06a7ff;
          }
        }
        .active {
          background: #06a7ff;
          &:hover {
            color: #fff;
          }
        }
      }
      .menu-sub-list {
        flex: 1;
        position: relative;
        padding: 5px 5px;
        .sub-menu {
          margin-top: 5px;
          cursor: pointer;
          padding: 10px 8px;
          border-radius: 5px;
          &:hover {
            color: #05a1f5;
          }
        }
        .active {
          background: #e8f4ff;
          color: #1890ff;
        }
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

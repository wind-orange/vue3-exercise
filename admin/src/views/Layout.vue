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
            :class="[
              'menu-item',
              currentPmenu.menuUrl == item.menuUrl ? 'active' : '',
            ]"
            v-for="item in userInfo.menuList"
            @click="pMenuClickHander(item)"
          >
            <div :class="['iconfont', 'icon-' + item.icon]"></div>
            <div class="menu-name">{{ item.menuName }}</div>
          </div>
        </div>
        <div class="menu-sub-list">
          <div
            :class="[
              'sub-menu',
              currentSubMenu.menuUrl == sub.menuUrl ? 'active' : '',
            ]"
            v-for="sub in currentPmenu.children"
            @click="jump(sub)"
          >
            {{ sub.menuName }}
          </div>
        </div>
      </div>
      <div class="main-content">
        <div class="tab-content">
          <el-tabs
            type="border-card"
            v-model="currentSubMenu.menuUrl"
            @tab-click="tabClick"
            @edit="editTab"
          >
            <el-tab-pane
              :name="item.menuUrl"
              :label="item.menuName"
              :closable="tabList.length > 1"
              v-for="item in tabList"
            >
              <div class="body-content">
                <RouterView></RouterView>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
  <UpdatePwd ref="updateMyPwdRef"></UpdatePwd>
</template>

<script setup>
import UpdatePwd from "@/components/UpdatePwd.vue";
import { getCurrentInstance, nextTick, onMounted, ref } from "vue";
import { useRouter, useRoute, RouterView } from "vue-router";
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
const userInfo = ref(
  JSON.parse(sessionStorage.getItem("userInfo")) || { menuList: [] }
);
// userinfo
const updateMyPwdRef = ref();
// 修改密码
const updateMyPwd = () => {
  updateMyPwdRef.value.show();
};
// 退出登录
const logout = () => {
  proxy.Confirm("确定要退出吗？", async () => {
    let result = await proxy.Request({
      url: "/logout",
    });
    if (!result) return;
    sessionStorage.removeItem("userInfo");
    router.push("/login");
  });
};

// 将菜单列表转换为对象进行存储
const menuMap = ref({});
const initMenuMap = () => {
  const menuList = userInfo.value.menuList;
  // {key:[menuUrl],value:[menuItem]}
  for (let p = 0; p < menuList.length; p++) {
    const pMenu = menuList[p];
    menuMap.value[pMenu.menuUrl] = pMenu;
    if (pMenu.children && pMenu.children.length > 0) {
      // {key:[subUrl],value:[parentPath,subItem]}
      for (let s = 0; s < pMenu.children.length; s++) {
        const sub = pMenu.children[s];
        sub["parentPath"] = pMenu.menuUrl;
        menuMap.value[sub.menuUrl] = sub;
      }
    }
  }
};
// 左侧菜单栏
const currentPmenu = ref({});
const currentSubMenu = ref({});

// 点击跳转到子菜单的第一个页面
const pMenuClickHander = (data) => {
  currentPmenu.value = data;
  let firstSubMenu = data.children[0];
  jump(firstSubMenu);
};
// 点击跳转
const jump = (data) => {
  if (currentSubMenu.value.menuUrl == data.menuUrl) return;
  currentSubMenu.value = data;
  addTabHander(data);
  router.push(data.menuUrl);
};
// 刷新保留页面
const menuSelect = (curPath, addTab) => {
  let curMenu = menuMap.value[curPath];
  if (curMenu == null) return;
  currentPmenu.value = menuMap.value[curMenu.parentPath];
  currentSubMenu.value = curMenu;
  if (addTab) addTabHander(curMenu);
};

onMounted(() => {
  initMenuMap();
  menuSelect(route.path, true);
});

// tab
const tabList = ref([]);

// 动态添加tab
const addTabHander = (curMenu) => {
  let currentTab = tabList.value.find((item) => {
    return item.menuUrl == currentSubMenu.value.menuUrl;
  });
  if (!currentTab) {
    tabList.value.push(curMenu);
  }
};
// 点击tab跳转到相应页面
const tabClick = (e) => {
  const path = e.props.name;
  menuSelect(path);
  router.push(path);
};
// 删除tab
const editTab = (targetKey, action) => {
  if (action != "remove") return;
  let curPath = currentSubMenu.value.menuUrl;
  let tabs = tabList.value;
  if (targetKey == curPath) {
    tabs.forEach((tab, index) => {
      if (tab.menuUrl === targetKey) {
        let nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) curPath = nextTab.menuUrl;
      }
    });
  }
  tabList.value = tabs.filter((tab) => tab.menuUrl != targetKey);
  if (curPath != currentSubMenu.value.menuUrl) {
    router.push(curPath);
    menuSelect(curPath);
  }
};
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

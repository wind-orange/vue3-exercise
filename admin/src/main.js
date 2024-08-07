import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/base.scss";
import "@/assets/icon/iconfont.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import Request from "@/utils/Request";
import Message from "@/utils/Message";
import Confirm from "@/utils/Confirm";
import Verify from "@/utils/Verify";
import PermissionCode from "@/utils/PermissionCode";

import VueCookies from "vue-cookies";

import Dialog from "./components/Dialog.vue";
import Table from "./components/Table.vue";
const app = createApp(App);

app.use(router);
app.use(ElementPlus);
app.component("Dialog", Dialog);
app.component("Table", Table);

app.config.globalProperties.Request = Request;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Confirm = Confirm;
app.config.globalProperties.Verify = Verify;
app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.PermissionCode = PermissionCode;

app.directive("has", {
  mounted: (el, binding, vnode) => {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    let permissionCodeList = userInfo.permissionCodeList;
    permissionCodeList =
      permissionCodeList == undefined ? [] : permissionCodeList;
    if (!permissionCodeList.includes(binding.value)) {
      el.parentNode.removeChild(el);
    }
  },
});

app.mount("#app");

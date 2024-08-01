import './assets/base.scss'
import "@/assets/icon/iconfont.css"

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Request from "@/utils/Request"
import Message from "@/utils/Message"
import Confirm from "@/utils/Confirm"

import VueCookies from "vue-cookies"

import Dialog from './components/Dialog.vue'
const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.component("Dialog",Dialog)

app.config.globalProperties.Request=Request
app.config.globalProperties.Message=Message
app.config.globalProperties.Confirm=Confirm
app.config.globalProperties.VueCookies=VueCookies

app.mount('#app')

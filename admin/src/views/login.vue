<template>
  <div class="login-body">
    <div class="left-bg"></div>
    <div class="right-panel">
      <el-form class="login-form" :model="formData" ref="formDataRef" :rules="rules" @submit.prevent>
        <div class="register">
          <div class="title">后台管理系统登录</div>
          <el-form-item prop="phone">
            <el-input placeholder="请输入账号"
            size="large" clearable
            v-model.trim="formData.phone">
              <template #prefix>
                <span class="iconfont icon-phone"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码"
            size="large"
            clearable
            type="password"
            show-password
            v-model.trim="formData.password">
              <template #prefix>
                <span class="iconfont icon-lock"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkCode">
            <div class="check-code-panel">
              <el-input placeholder="请输入验证码"
              size="large"
              clearable
              v-model.trim="formData.checkCode">
                <template #prefix>
                  <span class="iconfont icon-Safety"></span>
                </template>
              </el-input>
              <img class="check-code" :src="checkCodeUrl" @click="changeCheckCode">
            </div>
          </el-form-item>
          <el-form-item prop="rememberMe">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
          </el-form-item>
          <el-form-item prop="submit">
            <el-button class="btn" size="large" type="primary" @click="doSubmit">登录</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
    
<script setup>
import {getCurrentInstance, nextTick, onMounted, ref} from 'vue'
import md5 from 'js-md5';
const {proxy} = getCurrentInstance()

const formData = ref({})
const formDataRef = ref()
const rules = {
  phone:[{required:true,message:"请输入账号"}],
  password:[{required:true,message:"请输入密码"}],
  checkCode:[{required:true,message:"请输入验证码"}],
}
// 验证码
const api = {
  checkCode:"/api/checkCode",
  login:"/login"
}
const checkCodeUrl = ref(null)
const changeCheckCode = () => {
  checkCodeUrl.value = `${api.checkCode}?time=${new Date().getTime()}`
}
// 登录
const doSubmit = () =>{
  formDataRef.value.validate(async (valid) => {
    if(!valid){return}
    let parmas = {}
    Object.assign(parmas,formData.value)
    let cookieLoginInfo = proxy.VueCookies.get("loginInfo")
    let cookiePassword = cookieLoginInfo == null ? null : cookieLoginInfo.password
    if(parmas.password!=cookiePassword){
      parmas.password = md5(parmas.password)
    }
    let result = await proxy.Request({
      url:api.login,
      parmas,
      errorCallback:()=>{changeCheckCode()}
    })
    if(!result){return}
    // 记住我
    if(parmas.rememberMe){
      const loginInfo = {
        phone:parmas.phone,
        password:parmas.password,
        rememberMe:parmas.rememberMe
      }
      proxy.VueCookies.set("loginInfo",loginInfo,"7d")
    }else{
      proxy.VueCookies.remove("loginInfo")
    }
    proxy.Message.success("登陆成功")
  })
}


onMounted(() => init())
const init = () => {
  nextTick(() => {
      changeCheckCode()
      formDataRef.value.resetFields()
      formData.value = {}
      const cookieLoginInfo = proxy.VueCookies.get("loginInfo")
      if(cookieLoginInfo){
        formData.value = cookieLoginInfo
      }
    })
}

</script>
    
<style lang="scss" scoped>
.login-body{
  display: flex;
  height: calc(100vh);
  background-color: skyblue;

  .left-bg{
    flex: 1;
    background-image: url(../assets/login_img.png);
    background-size: 800px cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .right-panel{
    width: 430px;
    margin-right: 15%;
    margin-top: calc((100vh - 500px) / 2);
  }

  .register{
    padding: 25px;
    border-radius: 5px;
    background-color: #fff;

    .title{
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }

    .check-code-panel {
      display: flex;
      width: 100%;
      .check-code {
        margin-left: 5px;
      }
    }

    .btn {
      width: 100%;
    }
  }
}
</style>
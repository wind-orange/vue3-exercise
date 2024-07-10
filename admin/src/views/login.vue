<template>
  <div class="login-body">
    <div class="left-bg"></div>
    <div class="right-panel">
      <el-form class="login-form">
        <div class="register">
          <div class="title">后台管理系统登录</div>
          <el-form-item prop="phone">
            <el-input placeholder="请输入账号" size="large" clearable>
              <template #prefix>
                <span class="iconfont icon-phone"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码" size="large" clearable>
              <template #prefix>
                <span class="iconfont icon-lock"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkCode">
            <div class="check-code-panel">
              <el-input placeholder="请输入验证码" size="large" clearable>
                <template #prefix>
                  <span class="iconfont icon-Safety"></span>
                </template>
              </el-input>
              <img class="check-code">
            </div>
          </el-form-item>
          <el-form-item prop="rememberMe">
            <el-checkbox>记住我</el-checkbox>
          </el-form-item>
          <el-form-item prop="submit">
            <el-button class="btn" size="large" type="primary">登录</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
    
<script setup>
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
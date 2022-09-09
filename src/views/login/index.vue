<template>
  <div class="login-container" @keyup.enter="handleLogin">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      class="login-form"
      label-width="80px"
    >
      <h2 class="login-title">{{ systemName }}</h2>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名" :prefix-icon="User" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="密码"
          show-password
          :prefix-icon="Lock"
        />
      </el-form-item>
      <el-button @click="handleLogin" type="primary" :loading="loading">登录</el-button>
      <div class="version">版本号：{{ version }}</div>
      <div class="version" style="margin-top: -10px">
        账号：any &nbsp;&nbsp;&nbsp;&nbsp;密码：any
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { login } from "@/api/epgms/account/login";
import { ElMessage } from "element-plus";
import { useStore } from "vuex"
import router from '@/router'

let version = import.meta.env.VITE_VERSION
let systemName = import.meta.env.VITE_SYSTEM_NAME
let loading = false

const loginFormRef = ref(null)
const loginForm = reactive({
  username: 'admin',
  password: '123456'
})
const rules = reactive({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})
const store = useStore()
// 使用 action
const Login = (params) => store.dispatch('user/Login', params)

function handleLogin() {
  loginFormRef.value.validate(valid => {
    if (valid) {
      let params = Object.assign({}, loginForm)
      Login(params).then(res => {
        console.log('login2-------', res)
        ElMessage({
          type: 'success',
          message: '登录成功!',
          showClose: true
        })
        router.push('/')
      })
    } else {
      return false
    }
  })
}

</script>

<style lang="scss" scoped>

.login-container{
  width: 100vw;
  height: 100vh;
  background: #2d3a4b;
}

.login-form {
  width: 520px;
  padding: 233px 35px 0;
  margin: 0 auto;
  box-sizing: border-box;
}

.login-title {
  color: #fff;
  text-align: center;
  margin-bottom: 40px;
}

.el-form-item {
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  background: rgba(0, 0, 0, 0.1);
  color: #454545;
  border-radius: 5px;
}

.login-container input {
  background: transparent !important;
  outline: none;
  border: none;
  padding-left: 59px;
  height: 100%;
}

.login-container .el-input {
  width: 100%;
  height: 47px;
}

.login-container .el-form-item__content {
  position: relative;
  margin-left: 0 !important;
}

.login-user {
  position: absolute;
  font-size: 19px;
  color: #889aa4;
  left: 16px;
  top: 13px;
}

.login-container button {
  width: 100% !important;
  margin-top: 10px;
}

.eye {
  position: absolute;
  right: 18px;
  top: 16px;
  cursor: pointer;
  font-size: 16px;
}

.version {
  padding: 15px 0px;
  margin: 15px 0 0 0;
  color: #a6a6a6;
  font-size: 13px;
  // font-weight: bold;
}
</style>

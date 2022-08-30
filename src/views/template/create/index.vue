<template>
  <h1>template/create</h1>
  <el-button @click="findPageList">search</el-button>
  <el-button type="primary" @click="handleLogin2">search</el-button>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { useStore } from "vuex"
import { findPage } from '@/api/systemManagement/sysUser'

const store = useStore()

onMounted(() => {
  console.log(`the component is now mounted.`)
  ElMessage({
    type: 'warning',
    message: '登录页',
    showClose: true
  })
})

// 使用 action
const Login = (params) => store.dispatch('Login', params)

function findPageList() {
  let params = {
    pageNum: 1,
    pageSize: 10
  }
  findPage(params).then(res => {
    console.log('findPage-------', res)
  })
}


function handleLogin2() {
  let params = {
    username: 'admin',
    password: '123456'
  }
  Login(params).then(res => {
    console.log('login2-------', res)
  })
}
</script>

<style>
</style>
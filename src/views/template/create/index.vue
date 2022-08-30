<template>
  <h1>template/create</h1>
  <el-button @click="findPageList">search</el-button>
  <el-button type="primary" @click="handleLogin">search</el-button>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { findPage, login } from '@/api/systemManagement/sysUser'

onMounted(() => {
  console.log(`the component is now mounted.`)
  ElMessage({
    type: 'warning',
    message: '登录页',
    showClose: true
  })
})

function findPageList() {
  let params = {
    pageNum: 1,
    pageSize: 10
  }
  findPage(params).then(res => {
    console.log('findPage-------', res)
  })
}

function handleLogin() {
  let params = {
    username: 'admin',
    password: '123456'
  }
  login(params).then(res => {
    console.log('login-------', res)
  })
}
</script>

<style>
</style>
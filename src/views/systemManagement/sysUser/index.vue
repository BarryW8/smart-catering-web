<template>
  <div class="container">
    <div class="button-wrap">
      <el-button type="success" :icon="Plus">新增</el-button>
    </div>
    <el-table
      ref="singleTable"
      v-loading="loading"
      height="741"
      :data="tableData"
      border
      highlight-current-row
      :header-cell-style="{background:'#f5f5f5',color:'#333333'}">
      <el-table-column label="序号" width="60px" align="center">
        <template #default="scope">
          {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="telephone" label="手机号" align="center" />
      <el-table-column prop="realName" label="姓名" align="center" />
      <el-table-column prop="email" label="邮箱" align="center" />
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template #default>
          <el-button link type="primary">编辑</el-button>
          <el-button link type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      background
      :total="total"
      :page-sizes="[10, 20, 30]"
      :current-page="pageNum"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'
import { findPage } from '@/api/systemManagement/sysUser'
const loading = ref(false)
let tableData = ref([])
// ----分页----
let total = ref(0)
let pageNum = ref(1)
let pageSize = ref(10)
let listQuery = {
  keyword: '',
}


onMounted(() => {
  console.log(`the component is now mounted.`)
  findPageList()
})

const handleSizeChange = (val) => {
  if (val) {
    pageSize.value = val
  }
  findPageList()
}
const handleCurrentChange = (val) => {
  if (val) {
    pageNum.value = val
  }
  findPageList()
}

function findPageList() {
  let params = {
    pageNum: pageNum,
    pageSize: pageSize
  }
  loading.value = true
  findPage(params).then(res => {
    console.log('findPage-------', res)
    tableData.value = res.data.data
    total.value = res.data.total
    console.log('tableData-------', tableData)
  }).finally(() => {
    loading.value = false
  })
}


</script>


<style lang='scss' scoped>
.container {
  background: #fff;
  // border: 1px solid #fff;
  padding: 16px 20px;
}
.button-wrap {
  padding-bottom: 16px;
}
.el-pagination {
  background: #fff;
  padding: 16px;
  justify-content: center;  //居中
  //float: left;居左
  //float: right;居右
}
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #ff9800 !important; //修改默认的背景色
}
</style>
<template>
  <div class="container">
    <div class="button-wrap">
      <el-button type="success" :icon="Plus" @click="add">新增</el-button>
      <div  class="filter-wrap">
        <el-input v-model="formData.keyword" placeholder="请输入关键字">
          <template #append>
            <el-button :icon="Search"  @click="handleCurrentChange(1)" />
          </template>
        </el-input>
        <el-button style="margin: 0 16px" link type="primary" :icon="Filter" @click="drawerShow = true">高级搜索</el-button>
      </div>
    </div>

    <el-drawer
      v-model="drawerShow"
      title="高级搜索"
      size="20%"
      @close="drawerShow = false">
      <el-form
        ref="formDataRef"
        v-loading="loading"
        element-loading-text="数据加载中"
        label-position="top"
        size="large"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-col :span="24">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="formData.userName" maxlength="30" placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="手机号" prop="telephone">
            <el-input v-model="formData.telephone" maxlength="11" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="formData.realName" maxlength="30" placeholder="请输入真实姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="formData.email" maxlength="30" placeholder="请输入电子邮箱" />
          </el-form-item>
        </el-col>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button size="large">重置</el-button>
          <el-button type="primary" size="large">搜索</el-button>
        </div>
      </template>
    </el-drawer>

    <el-table
      ref="singleTable"
      v-loading="loading"
      height="741"
      :data="data.tableData"
      border
      highlight-current-row
      :header-cell-style="{background:'#f5f5f5',color:'#333333'}"
      @row-click="rowClick"
    >
      <el-table-column label="序号" width="60px" align="center">
        <template #default="scope">
          {{ (page.pageNum - 1) * page.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名" align="center" />
      <el-table-column prop="telephone" label="手机号" align="center" />
      <el-table-column prop="realName" label="姓名" align="center" />
      <el-table-column prop="email" label="邮箱" align="center" />
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="edit(scope.row)">编辑</el-button>
          <el-button link type="danger" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      background
      :total="data.total"
      :page-sizes="[10, 20, 30]"
      :current-page="page.pageNum"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <SaveForm
      v-if="saveShow"
      :show="saveShow"
      :sub-object="subObject"
      @refreshData="handleCurrentChange"
      @hideDialog="saveShow = false"
    />
  </div>
</template>

<script setup>
import SaveForm from '@/views/systemManagement/sysUser/save.vue'
import { Plus, Search, Filter } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { findPage, deleteById } from '@/api/systemManagement/sysUser'
const loading = ref(false)
const singleTable = ref(null)
let currentRow = ref({})
// 组件显隐
let saveShow = ref(false)
let drawerShow = ref(false)
// 父子组件传值
let subObject = reactive({
  title: ref('title'),
  params: ref({})
})
// 表数据
const data = reactive({
  total: 0,
  tableData: []
})
// 分页
const page = reactive({
  pageNum: 1,
  pageSize: 10,
})
// 过滤数据
let formData = ref({
  keyword: '',
})


onMounted(() => {
  console.log(`the component is now mounted.`)
  findPageList()
})

const add = () => {
  console.log('add----------')
  saveShow.value = true
  subObject.title = '新增'
}
const edit = (val) => {
  console.log('edit----------', val)
  saveShow.value = true
  subObject.title = '编辑'
  subObject.params = val
}
const del = (val) => {
  ElMessageBox.confirm('是否删除?', '提示', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(() => {
    deleteById({
      modelId: val.id
    }).then(res => {
      ElMessage({
        type: 'success',
        message: '删除成功',
        showClose: true
      })
      handleCurrentChange()
    })
  }).catch(() => {
  })
}

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

const rowClick = (val) => {
  // 当前行为空 或者 切换选中行
  if (currentRow !== val) {
    currentRow = val
  } else {
    // 取消高亮状态
    singleTable.value.setCurrentRow(null)
    currentRow = null
  }
}

function findPageList() {
  let params = Object.assign(formData, {
    pageNum: page.pageNum,
    pageSize: page.pageSize
  })
  loading.value = true
  findPage(params.value).then(res => {
    data.tableData = res.data.data
    data.total = res.data.total
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
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
}
.filter-wrap {
  display: flex;
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
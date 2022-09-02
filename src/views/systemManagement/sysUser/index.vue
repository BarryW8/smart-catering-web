<template>
  <div class="container">
    <div class="button-wrap">
      <el-button type="success" :icon="Plus" @click="add">新增</el-button>
      <div  class="filter-wrap">
        <el-input v-model="formData.keyword" clearable placeholder="请输入关键字">
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
        label-width="100px"
      >
        <el-col :span="24">
          <el-form-item label="用户状态">
            <el-select v-model="formData.userStatus" clearable style="width:100%" placeholder="请选择用户状态">
              <el-option label="启用" :value="0" />
              <el-option label="禁用" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button size="large" @click="reset">重置</el-button>
          <el-button type="primary" size="large" @click="handleCurrentChange(1)">搜索</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 表组件 -->
    <MTable
      :tableFilter="tableFilter"
      :tableData="tableData"
      :tableColumn="tableColumn"
      :loading="loading"
      :pageNum="pageNum"
      :pageSize="pageSize"
    />
    <!-- 分页组件 -->
    <MPagination
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      :pageSizes="[15, 30, 50]"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />

    <SaveForm
      v-if="saveShow"
      :show="saveShow"
      :sub-object="subObject"
      @refreshData="handleCurrentChange"
      @hideDialog="saveShow = false"
    />
    <DetailForm
      v-if="detailshow"
      :show="detailshow"
      :sub-object="subObject"
      @hideDialog="detailshow = false"
    />
  </div>
</template>

<script setup>
import SaveForm from '@/views/systemManagement/sysUser/save.vue'
import DetailForm from '@/views/systemManagement/sysUser/detail.vue'
import { Plus, Search, Filter } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { findPage, deleteById } from '@/api/systemManagement/sysUser'
import { userStatusFilter, sexFilter } from '@/dataMap/index'
// 组件显隐
let saveShow = ref(false)
let detailshow = ref(false)
let drawerShow = ref(false)
// 父子组件传值
let subObject = reactive({
	title: ref('title'),
	params: ref({})
})
// 过滤数据
const formData = reactive({
  keyword: '',
  userStatus: ''
})

const state = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 15,
  loading: false,
  tableFilter: {
    userStatusFilter: userStatusFilter,
    sexFilter: sexFilter,
  },
  tableData: [],
  tableColumn: [{
    width: '60',
    align: 'center',
    label: '序号',
    rowNumber: true
  }, {
    prop: 'userName',
    align: 'center',
    label: '用户名',
    btn: [{
      type: 'primary',
      func: detail
    }]
  }, {
    prop: 'telephone',
    align: 'center',
    label: '手机号'
  }, {
    prop: 'realName',
    align: 'center',
    label: '姓名'
  }, {
    prop: 'email',
    align: 'center',
    label: '邮箱'
  }, {
    prop: 'sex',
    align: 'center',
    label: '性别',
    filter: true
  }, {
    prop: 'userStatus',
    align: 'center',
    label: '用户状态',
    tag: true
  }, {
    fixed: 'right',
    width: '120',
    align: 'center',
    label: '操作',
    btn: [{
      name: '编辑',
      type: 'primary',
      func: edit
    }, {
      name: '删除',
      type: 'danger',
      func: del
    }]
  }]
})
const {
  total,
  pageNum,
  pageSize,
  loading,
  tableFilter,
  tableData,
  tableColumn,
} = toRefs(state)

// 初始化数据
onMounted(() => {
  console.log(`the component is now mounted.`)
  findPageList()
})

// 按钮点击事件
function add() {
  console.log('add----------')
  saveShow.value = true
  subObject.title = '新增'
  subObject.params = {}
}
function edit(val) {
  console.log('edit----------', val)
  saveShow.value = true
  subObject.title = '编辑'
  subObject.params = val
}
function detail(val) {
  console.log('detail----------', val)
  detailshow.value = true
  subObject.title = '查看'
  subObject.params = val
}
function del(val) {
  ElMessageBox.confirm('是否删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
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
      handleCurrentChange(1)
    })
  }).catch(() => {
  })
}

// 表数据查询
function handleSizeChange(val) {
  if (val) {
    state.pageSize = val
  }
  findPageList()
}
function handleCurrentChange(val) {
  if (val) {
    state.pageNum = val
  }
  findPageList()
}
function findPageList() {
  let params = Object.assign(formData, {
    pageNum: pageNum,
    pageSize: pageSize,
  })
  state.loading = true
  findPage(params).then(res => {
    state.tableData = res.data.data
    state.total = res.data.total
  }).finally(() => {
    state.loading = false
    drawerShow.value = false
  })
}
function reset() {
  formData.keyword = ''
  formData.userStatus = ''
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
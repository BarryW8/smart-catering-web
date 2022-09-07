<template>
  <div class="container">
    <div class="button-wrap">
      <div>
        <el-button type="success" :icon="Plus" @click="add">新增</el-button>
        <el-button type="primary" :icon="Avatar" @click="roleUser">授权用户</el-button>
      </div>
      <div class="filter-wrap">
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
          <el-form-item label="角色状态">
            <el-select v-model="formData.status" clearable style="width:100%" placeholder="请选择角色状态">
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

    <Table v-slot="{ tableHeight }">
      <!-- 表组件 -->
      <MTable
        :tableFilter="tableFilter"
        :tableData="tableData"
        :tableColumn="tableColumn"
        :height="tableHeight"
        :loading="loading"
        :pageNum="pageNum"
        :pageSize="pageSize"
        @getCurrentRow="getCurrentRow"
      />
      <!-- 分页组件 -->
      <MPagination
        :total="total"
        :pageNum="pageNum"
        :pageSize="pageSize"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </Table>

    <Save
      v-if="saveShow"
      :show="saveShow"
      :sub-object="subObject"
      @refreshData="handleCurrentChange"
      @hideDialog="saveShow = false"
    />
    <Detail
      v-if="detailShow"
      :show="detailShow"
      :sub-object="subObject"
      @hideDialog="detailShow = false"
    />
    <RoleUser
      v-if="roleUserShow"
      :show="roleUserShow"
      :sub-object="subObject"
      @hideDialog="roleUserShow = false"
    />
  </div>
</template>

<script setup>
import Save from '@/views/systemManagement/sysRole/save.vue'
import Detail from '@/views/systemManagement/sysRole/detail.vue'
import RoleUser from '@/views/systemManagement/sysRole/roleUser.vue'
import { Plus, Search, Filter, Avatar } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as sysRole from '@/api/systemManagement/sysRole'
import { statusFilter } from '@/dataMap/index'
// 组件显隐
const show = reactive({
  drawerShow: false,
  saveShow: false,
  detailShow: false,
  roleUserShow: false
})
const { drawerShow, saveShow, detailShow, roleUserShow } = toRefs(show)
// 父子组件传值
const subObject = reactive({
	title: 'title',
	params: {}
})
// 查询条件
const formData = reactive({
  keyword: '',
  status: ''
})
// 表格数据
const state = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 15,
  currentRow: null,
  loading: false,
  tableFilter: {
    statusFilter: statusFilter
  },
  tableData: [],
  tableColumn: [{
    prop: 'roleName',
    align: 'center',
    label: '角色名',
    btn: [{
      type: 'primary',
      func: detail
    }]
  }, {
    prop: 'status',
    align: 'center',
    label: '状态',
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
      func: deleteById
    }]
  }]
})
const {
  total,
  pageNum,
  pageSize,
  currentRow,
  loading,
  tableFilter,
  tableData,
  tableColumn
} = toRefs(state)

// 初始化数据
onMounted(() => {
  console.log(`the component is now mounted.`)
  handleCurrentChange()
})

// 按钮点击事件
function add() {
  console.log('add----------')
  show.saveShow = true
  subObject.title = '新增'
  subObject.params = {}
}
function edit(val) {
  console.log('edit----------', val)
  show.saveShow = true
  subObject.title = '编辑'
  subObject.params = val
}
function detail(val) {
  console.log('detail----------', val)
  show.detailShow = true
  subObject.title = '查看'
  subObject.params = val
}
function roleUser() {
  console.log('roleUser----------', state.currentRow)
  if (!state.currentRow) {
    ElMessage({
      type: 'warning',
      message: '请选择需要操作的记录',
      showClose: true
    })
    return
  }
  show.roleUserShow = true
  subObject.title = '授权角色'
  subObject.params = state.currentRow
}
function deleteById(val) {
  ElMessageBox.confirm('是否删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    sysRole.deleteById({
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
  findPage()
}
function handleCurrentChange(val) {
  if (val) {
    state.pageNum = val
  }
  findPage()
}
function findPage() {
  let params = Object.assign(formData, {
    pageNum: pageNum,
    pageSize: pageSize,
  })
  state.loading = true
  sysRole.findPage(params).then(res => {
    state.tableData = res.data.data
    state.total = res.data.total
  }).finally(() => {
    state.loading = false
    show.drawerShow = false
  })
}
function getCurrentRow(val) {
  state.currentRow = val
}
function reset() {
  formData.keyword = ''
  formData.status = ''
  handleCurrentChange(1)
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
</style>
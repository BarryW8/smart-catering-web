<template>
    <div class="container">
      <div ref="screen" class="button-wrap">
        <div>
          <el-button type="success" :icon="Plus" @click="add">新增</el-button>
        </div>
        <div class="filter-wrap">
          <el-input v-model="formData.keyword" clearable placeholder="请输入关键字">
            <template #append>
              <el-button :icon="Search"  @click="getList()" />
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
            <el-form-item label="状态">
              <el-select v-model="formData.status" clearable style="width:100%" placeholder="请选择状态">
                <el-option label="启用" :value="0" />
                <el-option label="禁用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
        <template #footer>
          <div style="flex: auto">
            <el-button size="large" @click="reset">重置</el-button>
            <el-button type="primary" size="large" @click="getList()">搜索</el-button>
          </div>
        </template>
      </el-drawer>
  
      <Table v-slot="{ tableHeight }">
        <!-- 表组件 -->
        <MTableTree
          ref="mTableTreeRef"
          :isSingle="true"
          :tableFilter="tableFilter"
          :tableData="tableData"
          :tableColumn="tableColumn"
          :height="tableHeight"
          :loading="loading"
        />
        <div ref="pagination" style="height: 60px" />
      </Table>
  
      <Save
        v-if="saveShow"
        :show="saveShow"
        :sub-object="subObject"
        @refreshData="getList"
        @hideDialog="saveShow = false"
      />
    </div>
  </template>
  
  <script setup>
  import Save from '@/views/systemManagement/dictionary/save.vue'
  import { Plus, Search, Filter } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import * as dictionary from '@/api/systemManagement/dictionary'
  import { statusFilter } from '@/dataMap/index'
  // 组件显隐
  const show = reactive({
    drawerShow: false,
    saveShow: false,
  })
  const { drawerShow, saveShow } = toRefs(show)
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
  const mTableTreeRef = ref(null)
  // 表格数据
  const state = reactive({
    currentRow: null,
    loading: false,
    tableFilter: {
      statusFilter: statusFilter
    },
    tableData: [],
    tableColumn: [{
      prop: 'name',
      align: 'center',
      label: '字典名称'
    }, {
      prop: 'code',
      align: 'center',
      label: '字典编号'
    }, {
      prop: 'parentCode',
      align: 'center',
      label: '父编号'
    }, {
      prop: 'status',
      align: 'center',
      label: '状态',
      tag: true
    }, {
      prop: 'note',
      align: 'center',
      label: '备注'
    }, {
      prop: 'orderBy',
      align: 'center',
      label: '排序'
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
    currentRow,
    loading,
    tableFilter,
    tableData,
    tableColumn
  } = toRefs(state)
  
  // 初始化数据
  onMounted(() => {
    console.log(`the component is now mounted.`)
    getList()
  })
  
  // 按钮点击事件
  async function add() {
    console.log('add----------')
    let selectList = await mTableTreeRef.value.getData()
    show.saveShow = true
    subObject.title = '新增'
    subObject.params = selectList && selectList.length > 0 ? selectList[0] : {}
  }
  function edit(val) {
    console.log('edit----------', val)
    show.saveShow = true
    subObject.title = '编辑'
    subObject.params = val
  }
  function deleteById(val) {
    ElMessageBox.confirm('是否删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      sysUser.deleteById({
        modelId: val.id
      }).then(res => {
        ElMessage({
          type: 'success',
          message: '删除成功',
          showClose: true
        })
        getList()
      })
    }).catch(() => {
    })
  }
  
  // 表数据查询
  function getList() {
    let params = Object.assign({}, formData)
    console.log('params------', params)
    state.loading = true
    dictionary.getList(params).then(res => {
      state.tableData = res.data
    }).finally(() => {
      state.loading = false
      show.drawerShow = false
    })
  }
  function reset() {
    formData.keyword = ''
    formData.status = ''
    getList()
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
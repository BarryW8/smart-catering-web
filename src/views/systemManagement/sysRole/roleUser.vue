<template>
    <el-dialog
      v-model="props.show"
      :title="props.subObject.title"
      :close-on-click-modal="false"
      draggable
      @close="hide"
    >
      <MTableMultiple
        ref="mTableMultiple"
        :tableData="tableData"
        :tableColumn="tableColumn"
        :selectList="selectList"
        height="440"
        :showTabs="true"
        :tabField="tabField"
        :loading="loading"
        :pageNum="pageNum"
        :pageSize="pageSize"
      />
      <!-- 分页组件 -->
      <MPagination
        :total="total"
        :pageNum="pageNum"
        :pageSize="pageSize"
        layout="total, prev, pager, next, jumper"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
      <!-- 弹窗按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="hide" size="large">取消</el-button>
          <el-button type="primary" @click="saveRoleUser" size="large">保存</el-button>   
        </div>
      </template>
    </el-dialog>
  </template>
  <script setup>
  import { ElMessage } from 'element-plus'
  import * as sysUser from '@/api/systemManagement/sysUser'
  import * as sysRole from '@/api/systemManagement/sysRole'
  // 父组件传值
  const props = defineProps(['show', 'subObject'])
  // 子组件回调
  const emits = defineEmits(['hideDialog'])
  
  const mTableMultiple = ref(null)
  
  // 过滤数据
  const formData = reactive({
    keyword: ''
  })
  const state = reactive({
    total: 0,
    pageNum: 1,
    pageSize: 10,
    loading: false,
    selectList: [],
    tableData: [],
    tabField: 'userName',
    tableColumn: [{
      prop: 'userName',
      align: 'center',
      label: '用户名'
    }, {
      prop: 'realName',
      align: 'center',
      label: '姓名'
    }, {
      prop: 'telephone',
      align: 'center',
      label: '手机号'
    }]
  })
  const {
    total,
    pageNum,
    pageSize,
    height,
    loading,
    selectList,
    tableData,
    tabField,
    tableColumn
  } = toRefs(state)
  
  // 初始化数据
  onMounted(() => {
    initData()
  })
  
  async function initData() {
    await findRoleUser()
    handleCurrentChange()
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
    sysUser.findPage(params).then(res => {
      state.tableData = res.data.data
      state.total = res.data.total
    }).finally(() => {
      state.loading = false
    })
  }
  
  // 详情
  const findRoleUser = () => {
    return new Promise(resolve => {
      state.loading = true
      sysRole.findRoleUser({
        modelId: props.subObject.params.id
      }).then(res => {
        res.data.forEach(item => {
          item.id = item.userId
          state.selectList.push(item)
        })
        resolve(res)
      }).finally(() => {
        state.loading = false
      })
    })
  }
  // 保存
  async function saveRoleUser() {
    let selectList = await mTableMultiple.value.getData()
    selectList.forEach(item => {
      item.userId = item.id
      item.roleId = props.subObject.params.id
    })
    let params = {
      roleId: props.subObject.params.id,
      userRoles: selectList
    }
    sysRole.saveRoleUser(params).then(res => {
      ElMessage({
        type: 'success',
        message: '保存成功',
        showClose: true
      })
      emits('hideDialog')
    })
  }
  // 关闭窗口
  const hide = () => {
    emits('hideDialog')
  }
  </script>
  <style lang='scss' scoped>
  </style>
  
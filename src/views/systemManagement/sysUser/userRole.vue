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
      :isSingle="true"
      :tableData="tableData"
      :tableColumn="tableColumn"
      :selectIds="selectIds"
      height="440"
      tabField="roleName"
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
        <el-button type="primary" @click="saveUserRole" size="large">保存</el-button>   
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
const emits = defineEmits()

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
  selectIds: [],
  tableData: [],
  tableColumn: [{
    prop: 'roleName',
    align: 'center',
    label: '角色名称'
  }]
})
const {
  total,
  pageNum,
  pageSize,
  height,
  loading,
  selectIds,
  tableData,
  tableColumn
} = toRefs(state)

// 初始化数据
onMounted(() => {
  initData()
})

async function initData() {
  await findUserRole()
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
  sysRole.findPage(params).then(res => {
    state.tableData = res.data.data
    state.total = res.data.total
  }).finally(() => {
    state.loading = false
  })
}

// 详情
const findUserRole = () => {
  return new Promise(resolve => {
    state.loading = true
    sysUser.findUserRole({
      modelId: props.subObject.params.id
    }).then(res => {
      state.selectIds = res.data || []
      resolve(res)
    }).finally(() => {
      state.loading = false
    })
  })
}
// 保存
async function saveUserRole() {
  let selectList = await mTableMultiple.value.getData()
  let params = {
    userId: props.subObject.params.id,
    roleId: selectList && selectList.length > 0 ? selectList[0].id : null
  }
  sysUser.saveUserRole(params).then(res => {
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

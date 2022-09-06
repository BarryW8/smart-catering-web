<template>
  <div>
    <el-dialog
      v-model="props.show"
      :title="props.subObject.title"
      :close-on-click-modal="false"
      draggable
      @close="hide"
    >
      <el-form
        ref="formDataRef"
        v-loading="loading"
        element-loading-text="数据加载中"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="字典名:" prop="name">
              <el-input v-model="formData.name" maxlength="30" placeholder="请输入字典名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典编号:" prop="code">
              <el-input v-model="formData.code" maxlength="30" placeholder="请输入字典编号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="父字典:" prop="parentId">
              <el-tree-select
                v-model="formData.parentId"
                :data="parentList"
                :render-after-expand="false"
                placeholder="请选择父字典"
                check-strictly
                clearable
                filterable
                value-key="id"
                :props="{ label: 'name' }"
                style="width:100%"
                @current-change="handleTreeChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:" prop="status">
              <el-select v-model="formData.status" style="width:100%" placeholder="请选择状态">
                <el-option label="启用" :value="0" />
                <el-option label="禁用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="备注:" prop="note">
              <el-input v-model="formData.note" maxlength="100" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序:" prop="orderBy">
              <el-input-number
                v-model="formData.orderBy"
                :controls="false"
                :min="1"
                :max="9999"
                style="width: 100%"
                :precision="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="24">
            <el-form-item label="相关配置:" prop="configValue">
              <el-input v-model="formData.configValue" type="textarea" :rows="2" maxlength="100" placeholder="请输入相关配置" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 弹窗按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="hide" size="large">取消</el-button>
          <el-button type="primary" @click="save" size="large">保存</el-button>   
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import * as dictionary from '@/api/systemManagement/dictionary'
// 父组件传值
const props = defineProps(['show', 'subObject'])
// 子组件回调
const emits = defineEmits()

const loading = ref(false)
const formDataRef = ref(null)
const state = reactive({
  parentList: [],
  formData: {
    name: '',
    code: '',
    status: 0,
    note: '',
    orderBy: 1,
    configValue: '',
    parentId: '',
    parentCode: ''
  }
})
const { formData, parentList } = toRefs(state)
const rules = reactive({
  name: [{ required: true, message: '字典名不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '字典编号不能为空', trigger: 'blur' }],
  orderBy: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
})


watch(
  () => state.formData.parentId,
  (val) => {
    if (!val) {
      state.formData.parentCode = ''
    }
  }
)

// 初始化数据
onMounted(() => {
  getList()
  if (Object.keys(props.subObject.params).length > 0) {
    if (props.subObject.title === '新增') {
      state.formData.parentId = props.subObject.params.id
      state.formData.parentCode = props.subObject.params.code
    } else {
      findById()
    }
  }
})

// 详情
const findById = () => {
  loading.value = true
  dictionary.findById({
    modelId: props.subObject.params.id
  }).then(res => {
    state.formData = res.data
  }).finally(() => {
    loading.value = false
  })
}
// 保存
const save = () => {
  formDataRef.value.validate(valid => {
    if (valid) {
      let params = state.formData
      dictionary.save(params).then(res => {
        ElMessage({
          type: 'success',
          message: '保存成功',
          showClose: true
        })
        emits('hideDialog')
        emits('refreshData')
      })
    } else {
      return false
    }
  })
}
// 表数据查询
function getList() {
  let params = Object.assign(formData)
  dictionary.getList(params).then(res => {
    state.parentList = res.data
  }).finally(() => {
  })
}
function handleTreeChange(val, node) {
  state.formData.parentCode = val.code
}
// 关闭窗口
const hide = () => {
  emits('hideDialog')
}
</script>
<style lang='scss'>
</style>

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
            <el-form-item label="用户名:" prop="userName">
              <el-input v-model="formData.userName" maxlength="30" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号:" prop="telephone">
              <el-input v-model="formData.telephone" maxlength="11" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="真实姓名:" prop="realName">
              <el-input v-model="formData.realName" maxlength="30" placeholder="请输入真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱:" prop="email">
              <el-input v-model="formData.email" maxlength="30" placeholder="请输入电子邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="用户状态:" prop="userStatus">
              <el-select v-model="formData.userStatus" style="width:100%" placeholder="请选择用户状态">
                <el-option label="启用" :value="0" />
                <el-option label="禁用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别:" prop="sex">
              <el-radio-group v-model="formData.sex">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="24">
            <el-form-item label="备注:" prop="note">
              <el-input v-model="formData.note" type="textarea" maxlength="100" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 弹窗按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="hide" size="large">取消</el-button>
          <el-button type="primary" @click="handleSave" size="large">保存</el-button>   
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { save, findById } from '@/api/systemManagement/sysUser'
// 父组件传值
const props = defineProps(['show', 'subObject'])
// 子组件回调
const emits = defineEmits()

const loading = ref(false)
const formDataRef = ref(null)
const formData = ref({
  userName: '',
  telephone: '',
  realName: '',
  email: '',
  userStatus: 0,
  sex: 0,
  note: ''
})
const rules = reactive({
  userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  telephone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
  realName: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }]
})

// 初始化数据
onMounted(() => {
  if (Object.keys(props.subObject.params).length > 0) {
    getInfo()
  }
})

// 详情
const getInfo = () => {
  loading.value = true
  findById({
    modelId: props.subObject.params.id
  }).then(res => {
    formData.value = res.data
  }).finally(() => {
    loading.value = false
  })
}
// 保存
const handleSave = () => {
  formDataRef.value.validate(valid => {
    if (valid) {
      let params = formData.value
      console.log(params)
      save(params).then(res => {
        console.log('handleSave-------', res)
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
// 关闭窗口
const hide = () => {
  emits('hideDialog')
}
</script>
<style lang='scss'>
</style>

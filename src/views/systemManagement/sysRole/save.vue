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
              <el-form-item label="角色名:" prop="roleName">
                <el-input v-model="formData.roleName" maxlength="30" placeholder="请输入角色名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色状态:" prop="status">
                <el-select v-model="formData.status" style="width:100%" placeholder="请选择角色状态">
                  <el-option label="启用" :value="0" />
                  <el-option label="禁用" :value="1" />
                </el-select>
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
            <el-button type="primary" @click="save" size="large">保存</el-button>   
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  <script setup>
  import { ElMessage } from 'element-plus'
  import * as sysRole from '@/api/systemManagement/sysRole'
  // 父组件传值
  const props = defineProps(['show', 'subObject'])
  // 子组件回调
  const emits = defineEmits()
  
  const loading = ref(false)
  const formDataRef = ref(null)
  const state = reactive({
    formData: {
      roleName: '',
      status: 0,
      note: ''
    }
  })
  const { formData } = toRefs(state)
  const rules = reactive({
    roleName: [{ required: true, message: '角色名不能为空', trigger: 'blur' }],
  })
  
  // 初始化数据
  onMounted(() => {
    if (Object.keys(props.subObject.params).length > 0) {
      findById()
    }
  })
  
  // 详情
  const findById = () => {
    loading.value = true
    sysRole.findById({
      modelId: props.subObject.params.id
    }).then(res => {
      state.formData = res.data.roleInfo
    }).finally(() => {
      loading.value = false
    })
  }
  // 保存
  const save = () => {
    formDataRef.value.validate(valid => {
      if (valid) {
        let params = state.formData
        console.log(params)
        sysRole.save(params).then(res => {
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
  
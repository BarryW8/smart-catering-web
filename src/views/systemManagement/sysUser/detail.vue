<template>
    <div>
      <el-dialog
        v-model="props.show"
        :title="props.subObject.title"
        :close-on-click-modal="false"
        draggable
        @close="hide"
      >
        <el-descriptions
          v-loading="loading"
          element-loading-text="数据加载中"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item label="用户名">{{ formData.userName }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ formData.telephone }}</el-descriptions-item>
          <el-descriptions-item label="真实姓名">{{ formData.realName }}</el-descriptions-item>
          <el-descriptions-item label="电子邮箱">{{ formData.email }}</el-descriptions-item>
          <el-descriptions-item label="用户状态">
            <el-tag>{{ filter(formData, 'userStatus') }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="性别">{{ filter(formData, 'sex') }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ formData.note }}</el-descriptions-item>
        </el-descriptions>

        <!-- 弹窗按钮 -->
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="hide" size="large">取消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  <script setup>
  // 拖拽弹窗
  import { ElMessage } from 'element-plus'
  import { findById } from '@/api/systemManagement/sysUser'
  // 父组件传值
  const props = defineProps(['show', 'subObject'])
  // 子组件回调
  const emits = defineEmits()
  
  const loading = ref(false)
  const formData = ref({
    userName: '',
    telephone: '',
    realName: '',
    email: '',
    userStatus: 0,
    sex: 0,
    note: ''
  })
  const filter = computed(() => {
    return (val, field) => {
      if (!val || !field) {
        return ''
      }
      if (field === 'userStatus') {
        switch(val[field]) {
          case 1:
            return '禁用'
          default:
            return '启用'
        }
      }
      if (field === 'sex') {
        switch(val[field]) {
          case 1:
            return '女'
          default:
            return '男'
        }
      }
    }
  })
  
  // 初始化数据
  onMounted(() => {
    getInfo()
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
  // 关闭窗口
  const hide = () => {
    emits('hideDialog')
  }
  </script>
  <style lang='scss' scoped>
  </style>
  
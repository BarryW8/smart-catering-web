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
            <el-tag>{{ filter(formData, 'userStatus').label || '' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="性别">{{ filter(formData, 'sex').label || '' }}</el-descriptions-item>
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
  import * as sysUser from '@/api/systemManagement/sysUser'
  import { userStatusFilter, sexFilter } from '@/dataMap/index'
  // 父组件传值
  const props = defineProps(['show', 'subObject'])
  // 子组件回调
  const emits = defineEmits()
  // 过滤列表
  const dataMap = {
    userStatusFilter, sexFilter
  }

  const loading = ref(false)
  const state = reactive({
    formData: {
      userName: '',
      telephone: '',
      realName: '',
      email: '',
      userStatus: 0,
      sex: 0,
      note: ''
    }
  })
  const { formData } = toRefs(state)

  const filter = computed(() => {
    return (val, field) => {
      if (!val || !field) {
        return ''
      }
      let filterArr = dataMap[`${field}Filter`]
      if (filterArr) {
        let obj = filterArr.find(i => i.value === val[field])
        return obj
      }
      return ''
    }
  })
  
  // 初始化数据
  onMounted(() => {
    findById()
  })
  
  // 详情
  const findById = () => {
    loading.value = true
    sysUser.findById({
      modelId: props.subObject.params.id
    }).then(res => {
      state.formData = res.data
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
  
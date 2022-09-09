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
            <el-form-item label="菜单标题:" prop="label">
              <el-input v-model="formData.label" maxlength="30" placeholder="请输入菜单标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标:" prop="iconPath">
              <el-input v-model="formData.iconPath" maxlength="30" placeholder="请输入图标" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="24">
            <el-form-item label="路由路径:" prop="routePath">
              <el-input v-model="formData.routePath" maxlength="120" placeholder="请输入路由路径" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="24">
            <el-form-item label="文件路径:" prop="pagePath">
              <el-input v-model="formData.pagePath" maxlength="120" placeholder="请输入文件路径" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="是否隐藏:" prop="isHide">
              <el-select v-model="formData.isHide" style="width:100%" placeholder="请选择状态">
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跳转类型:" prop="linkType">
              <el-select v-model="formData.linkType" style="width:100%" placeholder="请选择跳转类型">
                <el-option label="内链" :value="0" />
                <el-option label="外链" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="父菜单:" prop="parentId">
              <el-tree-select
                v-model="formData.parentId"
                :data="parentList"
                :render-after-expand="false"
                placeholder="请选择父字典"
                check-strictly
                clearable
                filterable
                value-key="id"
                :props="{ label: 'label' }"
                style="width:100%"
              />
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
            <el-form-item label="备注:" prop="configValue">
              <el-input v-model="formData.configValue" type="textarea" :rows="2" maxlength="100" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="按钮权限:" prop="permsList">
            <el-checkbox-group v-model="permsList">
              <el-checkbox
                v-for="(item, index) in buttonOption"
                :key="index"
                :label="item.code"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
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
import * as sysMenu from '@/api/systemManagement/sysMenu'
import * as dictionary from '@/api/systemManagement/dictionary'
// 父组件传值
const props = defineProps(['show', 'subObject'])
// 子组件回调
const emits = defineEmits()

const loading = ref(false)
const formDataRef = ref(null)
const state = reactive({
  buttonOption: [],
  permsList: [], // 按钮权限集合
  parentList: [],
  formData: {
    label: '',
    isHide: 0,
    linkType: 0,
    note: '',
    orderBy: 1,
    parentId: ''
  }
})
const { formData, buttonOption, permsList, parentList } = toRefs(state)
const rules = reactive({
  label: [{ required: true, message: '菜单标题不能为空', trigger: 'blur' }],
  isHide: [{ required: true, message: '是否隐藏不能为空', trigger: 'change' }],
  linkType: [{ required: true, message: '跳转类型不能为空', trigger: 'change' }],
  orderBy: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
})

// 初始化数据
onMounted(() => {
  getList()
  option4Dictionary()
  if (Object.keys(props.subObject.params).length > 0) {
    if (props.subObject.title === '新增') {
      state.formData.parentId = props.subObject.params.id
    } else {
      findById()
    }
  }
})

// 详情
const findById = () => {
  loading.value = true
  sysMenu.findById({
    modelId: props.subObject.params.id
  }).then(res => {
    if (res.data && res.data.parentId === '-1') {
      res.data.parentId = ''
    }
    if (res.data.perms) {
      state.permsList = res.data.perms.split(',')
    }
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
      if (state.permsList) {
        params.perms = state.permsList.join(',')
      }
      sysMenu.save(params).then(res => {
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
  let params = {}
  sysMenu.getList(params).then(res => {
    state.parentList = res.data
  }).finally(() => {
  })
}
// 表数据查询
function option4Dictionary() {
  let params = {
    parentCode: '001'
  }
  dictionary.optionList(params).then(res => {
    state.buttonOption = res.data
  }).finally(() => {
  })
}
// 关闭窗口
const hide = () => {
  emits('hideDialog')
}
</script>
<style lang='scss'>
</style>

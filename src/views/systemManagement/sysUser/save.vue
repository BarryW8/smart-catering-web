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
        <!-- <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="用户状态:" prop="userStatus">
              <el-select v-model="form.userStatus" style="width:100%" placeholder="请选择用户状态">
                <el-option label="启用" :value="0" />
                <el-option label="停用" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别:" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="24">
            <el-form-item label="备注:" prop="note">
              <el-input v-model="form.note" type="textarea" maxlength="100" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row> -->
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
// 拖拽弹窗
import { ElMessage } from "element-plus";
import { save, findById } from '@/api/systemManagement/sysUser'
const props = defineProps(['show', 'subObject'])
const emits = defineEmits(['hideDialog'])
const loading = ref(false)
const formDataRef = ref(null)
const formData = ref({
  userName: '',
  telephone: '',
  realName: '',
  email: ''
})
const rules = reactive({
  userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  telephone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
  realName: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }]
})

onMounted(() => {
  console.log(`the component is now mounted.`)
  console.log(props.subObject.params)
  if (Object.keys(props.subObject.params).length > 0) {
    getInfo()
  }
})

function getInfo() {
  loading.value = true
  findById({
    modelId: props.subObject.params.id
  }).then(res => {
    formData.value = res.data
  }).finally(() => {
    loading.value = false
  })
}

function handleSave() {
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

function hide() {
  emits('hideDialog')
}
// export default {
//   directives: { elDragDialog },
//   props: {
//     // 控制表单显隐
//     visible: {
//       type: Boolean
//     },
//     // 父页面参数
//     subObject: {
//       type: Object,
//       default: () => {
//         return {}
//       }
//     }
//   },
//   data() {
//     // =======自定义表单校验规则=========
//     var vaildateUserName = (rule, value, callback) => {
//       if (value !== '') {
//         // 判断是否包含空格
//         // var arr = []
//         // arr = value.split(' ')
//         // if (arr.length !== 1) {
//         //   callback(new Error('用户手机不允许包含空格'))
//         // }
//         var reg = /^1[3456789]\d{9}$/
//         if (!reg.test(value)) {
//           callback(new Error('请输入正确的手机号'))
//         }
//         this.$nextTick(() => {
//           var modelId = ''
//           if (this.user) {
//             modelId = this.user.id
//           }
//           // 查询用户手机是否已存在
//           checkUserName(modelId, value).then(res => {
//             if (res.data > 0) {
//               callback(new Error('用户手机已存在'))
//             } else {
//               callback()
//             }
//           })
//         })
//       }
//     }
//     return {
//       title: '', // 表单标题
//       dialogVisible: this.visible, // 需要定义变量使用，否则会报错问题
//       loading: false, // 表单是否显示加载图标
//       buttonLoading: false, // 按钮转圈
//       customerOptionList: [],
//       user: {}, // 用户对象
//       // 表单数据对象
//       form: {
//         sex: 0,
//         userStatus: 0
//       },
//       // 必填验证
//       rules: {
//         customerId: [
//           { required: true, message: '客户不能为空', trigger: 'change' }
//         ],
//         userCode: [
//           { required: true, message: '用户编号不能为空', trigger: 'blur' }
//         ],
//         userName: [
//           { required: true, message: '用户手机不能为空', trigger: 'blur' },
//           { validator: vaildateUserName, trigger: 'blur' }
//         ],
//         trueName: [
//           { required: true, message: '真实姓名不能为空', trigger: 'blur' }
//         ],
//         // sex: [
//         //   { required: true, message: '性别不能为空', trigger: 'change' }
//         // ],
//         userStatus: [
//           { required: true, message: '用户状态不能为空', trigger: 'change' }
//         ]
//       }
//     }
//   },
//   mounted() {
//     ParkingCommon.option4Customer().then(res => {
//       if (res.code === 0) {
//         this.customerOptionList = res.data
//       } else {
//         this.$message.error(res.msg)
//       }
//     })
//   },
//   created() {
//     this.user = this.subObject.params
//     if (this.subObject.opt === 'add') {
//       this.title = '新增'
//     }
//     if (this.subObject.opt === 'edit') {
//       this.title = '修改'
//       this.initInfo()
//     }
//   },
//   methods: {
//     initInfo() {
//       if (this.subObject.opt === 'edit') {
//         this.loading = true
//         sysUserInfo({
//           modelId: this.user.id
//         }).then(res => {
//           if (res.code === 0) {
//             this.form = res.data
//           } else if (res.code === -1) {
//             this.$message({
//               showClose: true,
//               message: res.msg,
//               type: 'warning'
//             })
//           } else {
//             this.$message({
//               showClose: true,
//               message: res.msg,
//               type: 'error'
//             })
//           }
//         }).finally(() => {
//           this.loading = false
//         })
//       }
//     },
//     save() {
//       this.$refs['form'].validate((valid) => {
//         if (valid) {
//           this.buttonLoading = true
//           var params = Object.assign({}, this.form, {
//             telephone: this.form.userName
//           })
//           saveSysUser(params).then(res => {
//             if (res.code === 0) {
//               this.$message({
//                 showClose: true,
//                 message: '保存成功',
//                 type: 'success'
//               })
//               this.hide()
//               // 刷新主页面
//               this.$emit('refreshList')
//             } else if (res.code === -1) {
//               this.$message({
//                 showClose: true,
//                 message: res.msg,
//                 type: 'warning'
//               })
//             } else {
//               this.$message({
//                 showClose: true,
//                 message: res.msg,
//                 type: 'error'
//               })
//             }
//           }).finally(() => {
//             this.buttonLoading = false
//           })
//         } else {
//           this.$message({
//             showClose: true,
//             type: 'warning',
//             message: '请完善表单信息!'
//           })
//           return false
//         }
//       })
//     },
//     hide() {
//       this.$emit('hideDialog')
//     }
//   }
// }
</script>
<style lang='scss'>
</style>

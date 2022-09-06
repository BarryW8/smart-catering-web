<template>
  <el-table
    ref="treeTableRef"
    v-loading="loading"
    :element-loading-text="loadingText"
    :height="height"
    :data="tableData"
    border
    :header-cell-style="{background:'#f5f5f5',color:'#333333'}"
    :class="{'hideSelectAll': isSingle}"
    row-key="id"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    @select="handleSelect"
    @select-all="handleSelectAll"
    @row-click="toggleSelection"
    @selection-change="handleSelectionChange"
  >
    <el-table-column v-if="rowNumber" type="index" align="center" label="序号" width="60" />
    <el-table-column type="selection" align="center" width="55" />
    <el-table-column
      v-for="(item, index) in tableColumn"
      :key="index"
      :prop="item.prop"
      :align="item.align"
      :label="item.label"
      :fixed="item.fixed"
      :width="item.width"
      show-overflow-tooltip
    >
      <template #default="scope">
        <span v-if="item.btn"> 
          <el-button v-for="(btn, i) in item.btn" :key="i" link :type="btn.type" @click="btn.func(scope.row)">
            {{ btn.name || scope.row[item.prop] || '' }}
          </el-button>
        </span>
        <span v-else-if="item.tag"> 
          <el-tag size="small" :type="filter(scope.row, item.prop).type">{{ filter(scope.row, item.prop).label || '' }}</el-tag>
        </span>
        <span v-else-if="item.filter">{{ filter(scope.row, item.prop).label || '' }}</span>
        <span v-else>{{ scope.row[item.prop] || '' }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
/**
 * 父组件传值
 */
const props = defineProps({
  // 表数据
  tableData: {
    type: Array,
    default: () => []
  },
  // 列配置
  tableColumn: {
    type: Array,
    default: () => []
  },
  // 数据过滤
  tableFilter: {
    type: Object,
    default: () => {}
  },
  // 回显选中集合
  selectList: {
    type: Array,
    default: () => []
  },
  // 是否显示序号
  rowNumber: {
    type: Boolean,
    default: true
  },
  // 是否显示加载图标
  loading: {
    type: Boolean,
    default: false
  },
  // 加载中文字
  loadingText: {
    type: String,
    default: '拼命加载中...'
  },
  // 是否显示序号
  pageNum: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 15
  },
  // 表高度
  height: {
    type: String,
    default: '640'
  },
  // 是否显示tab
  showTabs: {
    type: Boolean,
    default: false
  },
  // tab显示字段名称
  tabField: {
    type: String,
    default: 'name'
  },
  // 是否单选
  isSingle: {
    type: Boolean,
    default: false
  }
})
const { selectList } = toRefs(props) // 这样可以让子组件内的变量接收父组件的值并操作数据
/**
 * 子组件回调
 */
const emits = defineEmits()

// table ref
const treeTableRef = ref(null)
const state = reactive({
  selectList: selectList, // 选中记录集合
})
// const { selectList } = toRefs(state)

// 监听图表数据变化，回显勾选记录
watch(
  () => props.tableData,
  (val) => {
    // 复选框勾选
    nextTick(() => {
      val.forEach(row => {
        let index = props.selectList.findIndex(item => row.id === item.id)
        if (index > -1) {
          treeTableRef.value.toggleRowSelection(row)
        }
      })
    })
  }
)

// 过滤方法
const filter = computed(() => {
  return (val, field) => {
    if (!val || !field) {
      return ''
    }
    let filterArr = props.tableFilter[`${field}Filter`]
    if (filterArr) {
      let obj = filterArr.find(i => i.value === val[field])
      return obj
    }
    return ''
  }
})

// 复选框只选中单行
function handleSelectionChange(val) {
  if (!props.isSingle) {
    return
  }
  if (val.length > 1) {
    // 重置列表的选中
    treeTableRef.value.clearSelection()
    // val还是多选的数组，设置为每次只选中数组的最后一个
    treeTableRef.value.toggleRowSelection(val[val.length - 1])
  } else {
    state.selectList.splice(0)
    if (val.length === 1) {
      let lastOne = val[val.length - 1]
      state.selectList.push(lastOne)
    }
  }
}
// 点击行勾选复选框
function toggleSelection(row) {
  treeTableRef.value.toggleRowSelection(row)
  console.log('---------row', row)
  if (props.isSingle) {
    return
  }
  var index = state.selectList.findIndex(item => item.id === row.id)
  if (index > -1) {
    // 去勾
    state.selectList.splice(index, 1)
  } else {
    // 勾选
    state.selectList.push(row)
  }
}
// 勾选记录
function handleSelect(selection, row) {
  // console.log('---------selection', selection)
  console.log('---------row', row)
  if (props.isSingle) {
    return
  }
  var index = state.selectList.findIndex(item => item.id === row.id)
  if (index > -1) {
    // 去勾
    state.selectList.splice(index, 1)
  } else {
    // 勾选
    state.selectList.push(row)
  }
}
// 全选
function handleSelectAll(selection) {
  console.log('---------selection', selection)
  if (props.isSingle) {
    return
  }
  var flag = selection.length === 0
  props.tableData.forEach(row => {
    var index = state.selectList.findIndex(item => item.id === row.id)
    console.log(index)
    if (flag) {
      // 反选
      state.selectList.splice(index, 1)
    } else {
      // 全选
      if (index === -1) {
        state.selectList.push(row)
      }
    }
  })
}
// 关闭tag
function handleTagClose(name, index) {
  // 删除下标元素
  state.selectList.splice(index, 1)
  // 去勾
  props.tableData.forEach(row => {
    if (row[props.tabField] === name) {
      treeTableRef.value.toggleRowSelection(row, false)
    }
  })
}

// 需要在 defineExpose 这个函数中将方法暴露出去供父组件调用
defineExpose({ getData });
function getData() {
  return new Promise(resolve => {
    console.log(state.selectList)
    resolve(state.selectList)
  })
}
</script>

<style lang='scss' scoped>
  .tabs-wrap {
    background: #fafafa;
    border: #000 solid 1px;
    padding: 12px;
  }
  .tabs-item {
    width: 12%;
    height: 40px;
    font-size: 16px;
    margin-right: 8px;
    margin-top: 8px;
  }
  /* 禁用table表头的全选框 */
  .hideSelectAll {
    :deep(.el-table__header-wrapper) {
      .el-checkbox__inner {
        display: none !important;
      }
    }
  }
</style>
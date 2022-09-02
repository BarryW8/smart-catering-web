<template>
  <div v-if="showTabs" class="tabs-wrap">
    <div v-if="tagName.length > 0">
      <el-tag
        v-for="(name, index) in tagName"
        :key="index"
        :type="name"
        closable
        class="tabs-item"
        @close="handleTagClose(name, index)"
      >
        {{ name }}
      </el-tag>
    </div>
    <div v-else>{{ '暂无选中记录' }}</div>
  </div>
  <el-table
    ref="multipleTable"
    v-loading="loading"
    :element-loading-text="loadingText"
    :height="height"
    :data="tableData"
    border
    :header-cell-style="{background:'#f5f5f5',color:'#333333'}"
    @select="handleSelect"
    @select-all="handleSelectAll"
    @row-click="toggleSelection"
  >
    <el-table-column v-if="rowNumber" align="center" label="序号" width="60">
      <template #default="scope">
        <div v-if="pageNum && pageSize">{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</div>
        <div v-else>{{ scope.$index + 1 }}</div>
      </template>
    </el-table-column>
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
        <div v-if="item.btn"> 
          <el-button v-for="(btn, i) in item.btn" :key="i" link :type="btn.type" @click="btn.func(scope.row)">
            {{ btn.name || scope.row[item.prop] || '' }}
          </el-button>
        </div>
        <div v-else-if="item.tag"> 
          <el-tag size="small" :type="filter(scope.row, item.prop).type">{{ filter(scope.row, item.prop).label || '' }}</el-tag>
        </div>
        <div v-else-if="item.filter">{{ filter(scope.row, item.prop).label || '' }}</div>
        <div v-else>{{ scope.row[item.prop] || '' }}</div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
import { nextTick, reactive } from "vue-demi"

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
  // 选中ID集合
  selectIds: {
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
  showTabs: {
    type: Boolean,
    default: false
  },
  tabField: {
    type: String,
    default: 'name'
  }
})
const { selectIds } = toRefs(props)
// 子组件回调
const emits = defineEmits()

// table ref
const multipleTable = ref(null)
// 选中行
const multipleSelection = ref([])

const state = reactive({
  selectIds: selectIds, // 选中ID集合
  selectList: [], // 选中记录集合
  tagName: [], // 选中名称集合
})
const { selectList, tagName } = toRefs(state)

watch(
  () => props.tableData,
  (val) => {
    console.log('watch--------', state.selectIds)
    // 复选框勾选
    nextTick(() => {
      val.forEach(item => {
        console.log('watch--------', state.selectIds.indexOf(item.id) > -1)
        if (state.selectIds.indexOf(item.id) > -1) {
          multipleTable.value.toggleRowSelection(item)
        }
      })
    })
  }
)

/**
 * 过滤方法
 */
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
// const handleSelectionChange = (val) => {
//   console.log(val)
//   multipleSelection.value = val
// }
// // 点击行勾选复选框
// function toggleSelection(row) {
//   multipleTable.value.toggleRowSelection(row)
// }

// 点击行勾选复选框
function toggleSelection(row) {
  multipleTable.value.toggleRowSelection(row)
  console.log('---------row', row)
  if (state.selectIds.indexOf(row.id) > -1) {
    // 去勾
    var index = state.selectIds.findIndex(item => item === row.id)
    state.selectIds.splice(index, 1)
    state.selectList.splice(index, 1)
    state.tagName.splice(index, 1)
  } else {
    // 勾选
    state.selectIds.push(row.id)
    state.selectList.push(row)
    state.tagName.push(row[props.tabField])
  }
}
// 勾选记录
function handleSelect(selection, row) {
  // console.log('---------selection', selection)
  console.log('---------row', row)
  if (state.selectIds.indexOf(row.id) > -1) {
    // 去勾
    var index = state.selectIds.findIndex(item => item === row.id)
    state.selectIds.splice(index, 1)
    state.selectList.splice(index, 1)
    state.tagName.splice(index, 1)
  } else {
    // 勾选
    state.selectIds.push(row.id)
    state.selectList.push(row)
    state.tagName.push(row[props.tabField])
  }
}
// 全选
function handleSelectAll(selection) {
  console.log('---------selection', selection)
  var flag = selection.length === 0
  props.tableData.forEach(item => {
    var index = state.selectIds.indexOf(item.id)
    console.log(index)
    if (flag) {
      // 反选
      state.selectIds.splice(index, 1)
      state.selectList.splice(index, 1)
      state.tagName.splice(index, 1)
    } else {
      // 全选
      if (index === -1) {
        state.selectIds.push(item.id)
        state.selectList.push(item)
        state.tagName.push(item[props.tabField])
      }
    }
  })
}
// 关闭tag
function handleTagClose(name, index) {
  // 删除下标元素
  state.tagName.splice(index, 1)
  state.selectIds.splice(index, 1)
  state.selectList.splice(index, 1)
  // 去勾
  props.tableData.forEach(row => {
    if (row[props.tabField] === name) {
      multipleTable.value.toggleRowSelection(row, false)
    }
  })
}

// 需要在 defineExpose 这个函数中将方法暴露出去供父组件调用
defineExpose({ getData });
function getData() {
  return new Promise(resolve => {
    resolve(state.selectList)
  })
}

/**
 * 行点击事件
 */
// const rowClick = (val) => {
//   // 当前行为空 或者 切换选中行
//   if (currentRow.value !== val) {
//     currentRow.value = val
//   } else {
//     // 取消高亮状态
//     singleTable.value.setCurrentRow(null)
//     currentRow.value = null
//   }
//   emits('getCurrentRow', currentRow.value)
// }
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
</style>
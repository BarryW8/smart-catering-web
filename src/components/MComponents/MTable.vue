<template>
    <el-table
      ref="singleTable"
      v-loading="loading"
      :element-loading-text="loadingText"
      :height="height"
      :data="tableData"
      border
      highlight-current-row
      :header-cell-style="{background:'#f5f5f5',color:'#333333'}"
      @row-click="rowClick"
    >
      <el-table-column v-if="rowNumber" align="center" label="序号" width="60">
        <template #default="scope">
          <div v-if="pageNum && pageSize">{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</div>
          <div v-else>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
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
    type: Number,
    default: 640
  },
})
// 子组件回调
const emits = defineEmits()

// table ref
const singleTable = ref(null)
// 选中行
const currentRow = ref({})


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

/**
 * 行点击事件
 */
const rowClick = (val) => {
  // 当前行为空 或者 切换选中行
  if (currentRow.value !== val) {
    currentRow.value = val
  } else {
    // 取消高亮状态
    singleTable.value.setCurrentRow(null)
    currentRow.value = null
  }
  emits('getCurrentRow', currentRow.value)
}
</script>

<style lang='scss' scoped>
</style>
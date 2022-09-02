<template>
  <el-pagination
    background
    :total="total"
    :page-sizes="pageSizes"
    :current-page="pageNum"
    :page-size="pageSize"
    :layout="layout"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
/**
 * 父组件传值
 */
const props = defineProps({
  // 总记录数
  total: {
    type: Number,
    default: 0
  },
  // 当前页码
  pageNum: {
    type: Number,
    default: 0
  },
  // 当前页展示记录数
  pageSize: {
    type: Number,
    default: 0
  },
  // 每页展示记录数
  pageSizes: {
    type: Array,
    default: () => [15, 30, 50]
  },
  // 组件布局
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  }
})
// 子组件回调
const emits = defineEmits()

function handleSizeChange(val) {
  emits('handleSizeChange', val)
}
function handleCurrentChange(val) {
  emits('handleCurrentChange', val)
}
</script>

<style lang='scss' scoped>
  .el-pagination {
    background: #fff;
    padding: 16px;
    justify-content: center;  //居中
    //float: left;居左
    //float: right;居右
  }
  :deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
    background-color: #ff9800 !important; //修改默认的背景色
  }
</style>
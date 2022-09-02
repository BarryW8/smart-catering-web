<template>
  <el-pagination
    background
    :total="total"
    :page-sizes="pageSizes"
    :current-page="pageNum"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
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
    default: () => []
  },
  // 每页展示记录数
  pageSizes: {
    type: Array,
    default: () => []
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

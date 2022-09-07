<template>
    <slot :tableHeight="tableHeight" :tableTimer="tableTimer" />
</template>

<script setup>
const screen = ref(null)
const pagination = ref(null)
const tableHeight = ref(0)
const tableTimer = ref(0)

onMounted(() => {
    console.log('init Table---------')
    calHeight()
    window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
    tableTimer.value && clearTimeout(tableTimer.value)
    window.removeEventListener('resize', onResize)
})

// 表格自适应
function calHeight() {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 220
        if (screen.value) {
            const screen = screen.value.getBoundingClientRect()
            tableHeight.value -= screen
        }
        if (pagination.value) {
            const pagination = pagination.value.getBoundingClientRect()
            tableHeight.value -= pagination
        }
    })
}
function onResize() {
    tableTimer.value && clearTimeout(tableTimer.value)
    tableTimer.value = setTimeout(() => {
        calHeight()
    }, 500)
}

</script>
    

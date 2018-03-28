<template>
    <div class="salonList">
        <div class="tools">
            <el-button   @click="handleCreate" type="primary" icon="el-icon-plus">新增</el-button>
            <el-button   @click="handleEdit" type="info" icon="el-icon-edit">编辑</el-button>
            <el-button   @click="handleDel" type="danger" icon="el-icon-delete">删除</el-button>
        </div>
        <div class="main"></div>
    </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.salonList {
}
</style>



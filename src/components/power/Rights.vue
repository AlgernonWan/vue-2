<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图 -->
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    getRightsList() {
      this.rightsList = [{
        name: '商品管理',
        path: 'haha',
        level: '0',
        pid: 1
      }, {
        name: '用户管理',
        path: 'user',
        level: '0',
        pid: 2
      }, {
        name: '用户列表',
        path: 'user',
        level: '1',
        pid: 3
      }, {
        name: '添加用户',
        path: 'user',
        level: '2',
        pid: 4
      }]
    }
  }
}
</script>

<style lang="less" scoped>
.el-card{
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
  font-size: 13px;
}
</style>

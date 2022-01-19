<template>
  <!-- 面包屑导航 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :class="['vcenter']">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--      -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="角色名称" prop="rollName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column type="expand" label="详细信息" width="100px">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id"
                    :class="['dbbottom', i1 === 0 ? 'dbtop' : '', 'vcenter']" closable>
              <!--  渲染一级权限     -->
              <el-col :span="5">
                <el-tag closable @close="removeRightByID(scope.row, item1.id)"> {{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--     渲染二级权限         -->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'dbtop', 'vcenter']" v-for="(item2, i2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable @close="removeRightByID(scope.row, item2.id)" type="success">{{
                        item2.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18" :class="['vleft']">
                    <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable
                            @close="removeRightByID(scope.row, item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--    -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        @close="setRightDialogClose"
        ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // name: "Roles"
  data() {
    return {
      roleList: [],
      rightsList: [
        {
          id: 101,
          authName: '商品管理',
          path: null,
          children: [{
            id: 105,
            authName: '商品列表',
            path: null,
            children: [{
              id: 115,
              authName: '添加商品',
              path: null
            }]
          }, {
            id: 106,
            authName: '商品列表',
            path: null,
            children: [{
              id: 116,
              authName: '添加商品',
              path: null
            }]
          }]
        },
        {
          id: 201,
          authName: '用户管理',
          path: 'users',
          children: [{
            id: 205,
            authName: '用户列表',
            path: 'users',
            children: [{
              id: 215,
              authName: '添加用户',
              path: null
            }, {
              id: 216,
              authName: '删除用户',
              path: null
            }]
          }]
        }],
      setRightDialogVisible: false,
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    getRolesList() {
      this.roleList = [
        {
          id: 30,
          rollName: '主管',
          roleDesc: '技术负责人',
          children: [
            {
              id: 101,
              authName: '商品管理',
              path: null,
              children: [{
                id: 105,
                authName: '商品列表',
                path: null,
                children: [{
                  id: 115,
                  authName: '添加商品',
                  path: null
                }]
              }, {
                id: 106,
                authName: '商品列表',
                path: null,
                children: [{
                  id: 116,
                  authName: '添加商品',
                  path: null
                }]
              }]
            },
            {
              id: 201,
              authName: '用户管理',
              path: 'users',
              children: [{
                id: 205,
                authName: '用户列表',
                path: 'users',
                children: [{
                  id: 215,
                  authName: '添加用户',
                  path: null
                }]
              }]
            }]
        }]
      console.log('ok')
    },
    async removeRightByID() {
      const res = await this.$confirm('此操作将为角色删除权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (res !== 'confirm') {
        return this.$message.info('取消了删除')
      } else {
        console.log('确认删除')
        // 建议为角色赋值最新的权限,这样就不会被关闭
      }
    },
    showSetRightDialog(role) {
      this.roleId = role.id
      console.log(role)
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        console.log(node.id)
        return arr.push(node.id)
      }
      node.children.forEach(item =>
        this.getLeafKeys(item, arr))
    },
    // 监听对话框的关闭
    setRightDialogClose() {
      this.defKeys = []
    },
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 7px;
}

.el-tag {
  margin: 15px;
}

.dbtop {
  border-top: 1px solid #eee;
}

.dbbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
  text-align: center;
}

.vleft {
  text-align: left;
}

.el-table {
  margin-top: 15px;
  font-size: 13px;
}
</style>

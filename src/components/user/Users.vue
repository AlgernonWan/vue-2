<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图  -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
                    @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="role"
          label="角色">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeUserById(scope.row.name)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--  分页区域    -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!--  添加用户的对话框  -->
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="30%"
      center @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户对话框"
      :visible.sync="editDialogVisible"
      width="30%" center @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="30%"
      @close="setRoleDialogClosed">
      <span>{{ userInfo.name }}</span>
      <el-select v-model="selectRoleId" placeholder="请选择">
        <el-option
          v-for="item in rolesList"
          :key="item.id"
          :label="item.rollName"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      total: 4,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      tableData: [
        {
          role: '管理员',
          name: '王小虎',
          email: '上海市普陀区金沙江路 1518 弄',
          mg_state: true
        },
        {
          role: '员工',
          name: '王大虎',
          email: '上海市普陀区金沙江路 1517 弄',
          mg_state: false
        },
        {
          role: '员工',
          name: '王一虎',
          email: '上海市普陀区金沙江路 1519 弄',
          mg_state: false
        },
        {
          role: '员工',
          name: '王二虎',
          email: '上海市普陀区金沙江路 1516 弄',
          mg_state: true
        }],
      // 控制对话框的显示和隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      editForm: {},
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          {
            required: true, message: '请输入用户名', trigger: 'blur'
          },
          {
            min: 3, max: 10, message: '用户名长度在3-10字符之间', trigger: 'blur'
          }
        ],
        password: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
          },
          {
            min: 8, max: 16, message: '用户名长度在8-16字符之间', trigger: 'blur'
          }
        ],
        email: [
          {
            required: true, message: '请输入邮箱', trigger: 'blur'
          },
          {
            validator: checkEmail, trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true, message: '请输入手机号', trie: 'blur'
          },
          {
            validator: checkMobile, trigger: 'blur'
          }
        ]
      },
      addFormRef: {},
      editFormRules: {
        email: [
          {
            required: true, message: '请输入邮箱', trigger: 'blur'
          },
          {
            validator: checkEmail, trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true, message: '请输入手机号', trie: 'blur'
          },
          {
            validator: checkMobile, trigger: 'blur'
          }]
      },
      editFormRef: {},
      setRoleDialogVisible: false,
      userInfo: {},
      // 所有的角色列表
      rolesList: [
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
        }
      ],
      // 已选中的角色ID
      selectRoleId: ''
    }
  },
  methods: {
    // async getUsersList() {
    //   const { data: res } = await this.$http.get('users', {
    //     params: this.queryInfo
    //   })
    //   if (res.mate.status != 200) {
    //     return this.$message.error('获取数据失败')
    //   }
    //
    // }
    handleSizeChange(newSize) {
      console.log(newSize)
    },
    handleCurrentChange(newPage) {
      console.log(newPage)
    },
    userStateChange(userInfo) {
      console.log(userInfo)
      // this.$http.put()
    },
    getUserList() {
      console.log(this.queryInfo.query)
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        // console.log(valid)
        if (!valid) {
          console.log('no')
          return null
        }
        console.log('ok')
      })
    },
    editUserDialog(userInfo) {
      this.editDialogVisible = true
      console.log(userInfo)
      this.editForm = userInfo
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editUser() {
      this.$refs.addFormRef.validate(valid => {
        // console.log(valid)
        if (!valid) {
          console.log('no')
          return null
        }
        console.log('ok')
      })
    },
    async removeUserById(username) {
      console.log(username)
      const ref = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除,则返回值为字符串 -> confirm
      // 如果用户取消了删除,则返回值为字符串 -> cancel
      // console.log(ref)
      if (ref !== 'confirm') {
        return this.$message.info('取消删了删除')
      } else {
        console.log('已经删除了用户')
      }
    },
    setRole(userInfo) {
      this.setRoleDialogVisible = true
      this.userInfo = userInfo
    },
    saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色!')
      }
      console.log(this.selectRoleId)
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed() {
      this.selectRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}

.el-row {
  text-align: left;
}

.el-table {
  margin-top: 15px;
  font-size: 13px;
}

.el-pagination {
  text-align: left;
  margin-top: 15px;
}

</style>

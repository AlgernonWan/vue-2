<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt=""/>
        <span>后台管理</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">{{ isCollapse ? "展开" : "折叠" }}</div>
        <el-menu background-color="antiquewhite"
                 text-color="blue"
                 active-text-color="#ffd04b" unique-opened :collapse="isCollapse" :collapse-transition="false" router
                 :default-active="activePath">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <!--            router 开启跳转按照index跳转-->
            <el-menu-item :index="'/' + 'users'" @click="saveNavState('/' + 'users')">
              <template>
                <i class="el-icon-location"></i>
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item :index="'/' + 'rights'" @click="saveNavState('/' + 'rights')">
              <template>
                <i class="el-icon-location"></i>
                <span>权限列表</span>
              </template>
            </el-menu-item>
            <el-menu-item :index="'/' + 'roles'" @click="saveNavState('/' + 'roles')">
              <template>
                <i class="el-icon-location"></i>
                <span>角色列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 点击按钮, 切换菜单折叠/展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: pink;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    > img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: antiquewhite;

  .el-submenu {
    text-align: left;
  }

  .el-menu {
    border-right: 0;
  }
}

.toggle-button {
  background-color: mediumpurple;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-main {
  background-color: bisque;
}
</style>

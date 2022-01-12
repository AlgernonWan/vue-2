<template>
  <div class="login_container">
    <div class="login_box"></div>
  </div>
</template>

<script>
export default {}
</script>

// 在vue脚手架中如果配置过高可以采用先卸载,在安装指定的版本
// npm uninstall less      npm uninstall less-loader
// npm install less@3.9.0      npm install less-loader@5.0.0
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
}
</style>

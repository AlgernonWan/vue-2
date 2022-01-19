import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8008/'
axios.interceptors.request.use(
  config => {
    if (window.sessionStorage.getItem('token')) {
      config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
    }
    return config
  }
)

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router, render: h => h(App)
}).$mount('#app')

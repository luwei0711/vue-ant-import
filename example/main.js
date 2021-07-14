import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import AntImport from '../src/index'

Vue.config.productionTip = false
Vue.use(Antd)
Vue.component(AntImport.name, AntImport)

new Vue({
  render: h => h(App)
}).$mount('#app')

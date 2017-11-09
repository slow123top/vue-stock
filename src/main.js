import 'babel-polyfill'
import Vue from 'vue'
import router from './router'
import store from './vuex/store'
import menhu from './Hitqt'
import iView from 'iview';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css';
import 'iview/dist/styles/iview.css';
import 'font/iconfont.css'
Vue.use(iView)
Vue.use(ElementUI)
new Vue({
  el: '#app',
  router,
  template: '<menhu/>',
  components: {
    menhu
  },
  store
})

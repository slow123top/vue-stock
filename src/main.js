import 'babel-polyfill'
import Vue from 'vue'
import router from './router'
import store from './vuex/store'
import menhu from './Hitqt'
import iView from 'iview';
import {RadioGroup, RadioButton,Tooltip,Button,Message,Carousel,CarouselItem,Table, TableColumn,Pagination,DatePicker} from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-default/base.css';
import 'iview/dist/styles/iview.css';
Vue.use(iView)
// Vue.use(Message)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Tooltip)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Button)
Vue.use(DatePicker)
Vue.prototype.$message = Message
new Vue({
  el: '#app',
  router,
  template: '<menhu/>',
  components: {
    menhu
  },
  store
})

import Vue from 'vue';
import { MessageBox, Message, Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueMoment from 'vue-moment';
import moment from 'moment-timezone';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueMoment, {
  moment,
});
Vue.prototype.$http = axios;

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading;

Vue.prototype.moment = moment;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

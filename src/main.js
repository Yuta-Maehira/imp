import Vue from 'vue'
import App from './App.vue'
import router from './plugins/router'
import store from './plugins/store'
import VuePaginate from 'vue-paginate';
import VueCarousel from 'vue-carousel';

require('@/assets/sass/main.scss')

Vue.config.productionTip = false
Vue.use(VuePaginate);
Vue.use(VueCarousel);

store.dispatch('autoLogin')
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue';
import './modules/vuetify-custom';
import VueRouter from 'vue-router';
import router from './router';
import App from './App.vue';
import store from './store';

import { i18n } from './modules/vue-i18n-setup';
import cookies from './modules/vue-cookies-custom';
import _cm from './modules/common-methods';
import axios from './modules/axios-custom';

Vue.config.productionTip = false;

// Plugins
Vue.use(VueRouter);

// Custom proptotype
Vue.prototype.$env = process.env;
Vue.prototype.$axios = axios;
Vue.prototype.$cookies = cookies;
Vue.prototype._cm = _cm;

new Vue({
	i18n,
	router,
	store,
	render: h => h(App)
}).$mount('#app');

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import Vuelidate from "vuelidate";

Vue.config.productionTip = false;
Vue.use(Vuelidate);

new Vue({
  router,
  axios,
  render: (h) => h(App),
}).$mount("#app");

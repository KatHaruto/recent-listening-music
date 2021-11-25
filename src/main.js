import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { VueMasonryPlugin } from "vue-masonry";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  VueMasonryPlugin,
  render: (h) => h(App),
}).$mount("#app");

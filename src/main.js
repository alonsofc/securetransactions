import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import MoshaToast from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import { loadFonts } from "./plugins/webfontloader";
import config from "./configs/config.json";

const app = createApp(App);

loadFonts();

app.config.globalProperties.$config = config;

app.use(router).use(store).use(MoshaToast).use(vuetify).mount("#app");

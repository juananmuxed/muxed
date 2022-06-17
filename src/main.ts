import { getLS } from "@/utils/localStorage";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import es from "./locales/es.json";

import App from "./App.vue";
import router from "./router";

export const i18n = createI18n({
  locale: getLS("lang") || "en",
  fallbackLocale: "en",
  messages: {
    en: en,
    es: es,
  },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");

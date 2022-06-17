import { Constants } from "@/config/constants";
import { i18n } from "@/main";
import router from "@/router";
import { getLS, setLS } from "@/utils/localStorage";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useLanguageStore = defineStore("language", () => {
  const storageName = "muxed-lang";
  const lang = ref(getLS(storageName) || "en");

  watch(lang, langToggle);

  function langToggle() {
    i18n.global.locale = lang.value;
    setLS(storageName, String(lang.value));
    const title = router.currentRoute.value.meta.title as string;
    const translationTitle = i18n.global.t("menu." + title);
    document.title = `${translationTitle}@${Constants.WEB_NICKNAME}~$`;
  }

  langToggle();

  return {
    lang,
  };
});

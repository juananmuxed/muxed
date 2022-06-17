import { getLS, setLS } from "@/utils/localStorage";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDarkThemeStore = defineStore("darkTheme", () => {
  const storageName = "muxed-dark";
  const bodyElement = document?.querySelector("body");
  const darkMode = ref(getLS(storageName) === "true");

  watch(darkMode, modeToggle);

  function dark(): void {
    bodyElement?.classList.remove("light");
  }

  function light() {
    bodyElement?.classList.add("light");
  }

  function modeToggle() {
    if (darkMode.value) {
      light();
    } else {
      dark();
    }
    setLS(storageName, String(darkMode.value));
  }

  modeToggle();

  return {
    darkMode,
  };
});

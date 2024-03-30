import { ref, watch } from 'vue';

import { getLS, setLS } from 'src/utils/Storage';
import { LOCAL_STORAGE } from 'src/constants/Keys';

export const useDark = () => {
  const bodyElement = document?.querySelector('body');
  const darkMode = ref(getLS(LOCAL_STORAGE.THEME) === 'true');

  watch(darkMode, modeToggle);

  function dark(): void {
    bodyElement?.classList.remove('light');
  }

  function light() {
    bodyElement?.classList.add('light');
  }

  function modeToggle() {
    if (darkMode.value) {
      light();
    } else {
      dark();
    }
    setLS(LOCAL_STORAGE.THEME, String(darkMode.value));
  }

  modeToggle();

  return {
    darkMode,
  };
};

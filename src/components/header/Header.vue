<template>
  <header>
    <nav>
      <ul>
        <li v-for="(menu, index) in getMenu()" :key="index">
          <RouterLink v-if="menu.show && menu.url" :to="{ name: menu.url }">
            {{ $t(menu.title) }}
          </RouterLink>
        </li>
        <li>
          <select v-model="lang">
            <option v-for="locale in availableLocales" :key="`locale-${locale}`" :value="locale">
              {{ locale.label }}
            </option>
          </select>
        </li>
        <li>
          <MSwitch v-model="dark.darkMode.value" />
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref, watch } from 'vue';

import { useDark } from 'src/composables/UseDark';
import { availableLocales, loadLanguageAsync } from 'src/plugins/I18n';
import { getLS } from 'src/utils/Storage';
import { LOCAL_STORAGE } from 'src/constants/Keys';
import { useTitle } from 'src/composables/UseTitle';
import router, { getMenu } from 'src/router/Router';

const dark = useDark();
const title = useTitle();

const langToken = getLS(LOCAL_STORAGE.LANG) || 'es';

const lang = ref(availableLocales.find((locale) => locale.value === langToken));

watch(lang, async (newValue) => {
  await loadLanguageAsync(newValue?.value || 'es');
  title.setTitle(router.currentRoute.value);
});
</script>

<style lang="scss" scoped src="@/assets/scss/components/header.scss" />

<script setup lang="ts">
import { useDarkThemeStore } from "@/stores/darkTheme";
import { useLanguageStore } from "@/stores/language";
import { RouterLink } from "vue-router";
import menu from "./menu.json"
import MSwitch from "../MSwitch.vue"

import type { JSONObject } from '@/types/ICommons'

const darkTheme = useDarkThemeStore();
const language = useLanguageStore()
</script>

<template>
  <header>
    <nav>
      <ul>
        <li v-for="(link, index) in menu.links" :key="index">
          <RouterLink :to="link.url">{{ $t(`menu.${link.name}`) }}</RouterLink>
        </li>
        <li>
          <select v-model="language.lang">
            <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
              {{ (menu.locales as JSONObject)[locale] }}
            </option>
          </select>
        </li>
        <li>
          <MSwitch v-model="darkTheme.darkMode"></MSwitch>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" scoped src="@/assets/scss/components/header.scss">
</style>
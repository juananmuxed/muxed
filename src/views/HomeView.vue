<script setup lang="ts">
import { Constants } from "@/config/constants";
import content from "@/locales/en.json";
</script>

<template>
  <div class="container">
    <h1 v-html="$t('titles.home', {nickname: Constants.WEB_NICKNAME })"></h1>
    <p v-html="$t(`paragraphs.home.${index}`)" v-for="(paragraph, index) in content.paragraphs.home" :key="'p-' + index"></p>
  </div>
</template>

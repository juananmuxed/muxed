<script setup lang="ts">
import content from "@/locales/en.json";
</script>

<template>
  <div class="container">
    <h1 v-html="$t('titles.about')"></h1>
    <p v-html="$t(`paragraphs.about.${index}`)" v-for="(paragraph, index) in content.paragraphs.about" :key="'p-' + index"></p>
  </div>
</template>

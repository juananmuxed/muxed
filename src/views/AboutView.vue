<script setup lang="ts">
import content from "@/locales/en.json";
import { useLinks } from '@/stores/links';

const links = useLinks();
</script>

<template>
  <div class="container">
    <h1 v-html="$t('titles.about')"></h1>
    <p v-html="$t(`paragraphs.about.${index}`)" v-for="(paragraph, index) in content.paragraphs.about"
      :key="'p-' + index"></p>
    <div class="list-links margin-bottom">
      <a v-for="(link, index) in links.gitHubProjects" :href="link.url" target="_blank">{{ link.text }}</a>
    </div>
    <h2>{{ $t('social') }}</h2>
    <div class="list-links">
      <a v-for="(link, index) in links.socialNetworks" :href="link.url" target="_blank">{{ link.text }}</a>
    </div>
  </div>
</template>

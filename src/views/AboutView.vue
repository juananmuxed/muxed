<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">
    <h1 v-html="$t('titles.about')" />
    <p
      v-for="(paragraph, index) in content.paragraphs.about" :key="'p-' + index"
      v-html="$t(`paragraphs.about.${index}`)"
    />
    <div class="list-links margin-bottom">
      <a
        v-for="(link, index) in links.gitHubProjects"
        :key="index + '-list-links'" :href="link.url" target="_blank"
      >{{ link.text }}</a>
    </div>
    <h2>{{ $t('others.social') }}</h2>
    <div class="list-links">
      <a
        v-for="(link, index) in links.socialNetworks"
        :key="index + '-list-links-social'" :href="link.url" target="_blank"
      >{{ link.text }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLinks } from 'src/composables/UseLinks';
import content from 'src/locales/en/en';

const links = useLinks();
</script>

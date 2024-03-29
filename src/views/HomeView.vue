<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">
    <h1 v-html="$t('titles.home', { nickname: APP_CONST.NAME })" />
    <p
      v-for="(paragraph, index) in content.paragraphs.home" :key="'p-' + index"
      v-html="$t(`paragraphs.home.${index}`)"
    />
    <p>
      <RouterLink to="/about" v-html="$t('others.seeMoreAbout')" />
    </p>
  </div>
</template>

<script setup lang="ts">
import { APP_CONST } from 'src/constants/App';
import content from 'src/locales/en/en';
</script>

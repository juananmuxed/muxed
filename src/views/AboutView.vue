<script setup lang="ts">
import content from "@/locales/en.json";
</script>

<template>
  <div class="container">
    <h1 v-html="$t('titles.about')"></h1>
    <p v-html="$t(`paragraphs.about.${index}`)" v-for="(paragraph, index) in content.paragraphs.about"
      :key="'p-' + index"></p>
    <div class="list-links">
      <a href="https://github.com/juananmuxed/teamcoo" target="_blank">TeamCoo</a>
      <a href="https://github.com/juananmuxed/muxed" target="_blank">MuXeD</a>
      <a href="https://github.com/juananmuxed/rpg-utils" target="_blank">RPG Utils</a>
      <a href="https://github.com/juananmuxed/dni-utils" target="_blank">DNI Utils</a>
      <a href="https://github.com/juananmuxed/muxbot-rpg" target="_blank">MuXBoT RPG</a>
    </div>
  </div>
</template>

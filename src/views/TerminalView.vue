<template>
  <div class="container">
    <h1 v-html="$t('titles.terminal') + ' >_'"></h1>
    <h4>
      <a href="https://github.com/juananmuxed/muxed" target="_blank">{{ $t('seeGitHub') }}</a>
      <MBadgeVue class="margin-left" color="warning" align="top">{{ $t('beta') }}</MBadgeVue>
    </h4>
    <div class="terminal-container">
      <MTerminalVue></MTerminalVue>
    </div>
  </div>
</template>

<script setup lang="ts">
import MBadgeVue from "../components/MBadge.vue";
import MTerminalVue from "../components/terminal/MTerminal.vue";
</script>

<style scoped>
</style>
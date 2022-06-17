<template>
  <div class="container">
    <h1 v-html="$t('titles.terminal') + ' >_'"></h1>
    <p>
      <MBadgeVue color="warning" align="top">{{ $t('beta') }}</MBadgeVue>
    </p>
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
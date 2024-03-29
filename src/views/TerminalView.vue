<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">
    <h1 v-html="$t('titles.terminal') + ' >_'" />
    <h4>
      <a href="https://github.com/juananmuxed/muxed" target="_blank">{{ $t('others.seeGitHub') }}</a>
      <MBadgeVue class="margin-left" color="warning" align="top">
        {{ $t('others.beta') }}
      </MBadgeVue>
    </h4>
    <div class="terminal-container">
      <!-- <MTerminalVue /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>

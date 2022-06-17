<script setup lang="ts">
import { Constants } from "@/config/constants";
import MBadgeVue from "../MBadge.vue";
import configPackage from '../../../package.json';
</script>

<template>
  <footer>
    <span>
      <a href="https://github.com/juananmuxed" target="_blank">GitHub</a>
    </span>
    <MBadgeVue color="primary" align="middle">v{{ configPackage.version }}</MBadgeVue>
    <span>© {{ new Date().getFullYear() }} <a href="https://muxed.dev" target="_blank">{{ Constants.WEB_NICKNAME
    }}</a></span>
  </footer>
</template>

<style scoped  src="@/assets/scss/components/footer.scss">
</style>
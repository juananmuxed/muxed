<script setup lang="ts">
import { Constants } from "@/config/constants";
import MBadgeVue from "../MBadge.vue";
import configPackage from '../../../package.json';
import { useLinks } from '@/stores/links';

const links = useLinks();
</script>

<template>
  <footer>
    <span v-for="(link, index) in links.socialNetworks">
      <a :href="link.url" target="_blank">{{ link.text }}</a>
    </span>
    <MBadgeVue color="primary" align="middle">v{{ configPackage.version }}</MBadgeVue>
    <span>© {{ new Date().getFullYear() }} <a href="https://muxed.dev" target="_blank">{{ Constants.WEB_NICKNAME
    }}</a></span>
  </footer>
</template>

<style scoped  src="@/assets/scss/components/footer.scss">
</style>
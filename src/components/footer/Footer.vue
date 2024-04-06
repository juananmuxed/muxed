<template>
  <footer>
    <span v-for="(link, index) in links.socialNetworks" :key="index + '-social-links'">
      <a :href="link.url" target="_blank">{{ link.text }}</a>
    </span>
    <MBadge color="primary" align="middle">
      v{{ configPackage.version }}
    </MBadge>
    <span>© {{ new Date().getFullYear() }} <a href="https://muxed.dev" target="_blank">{{ APP_CONST.NAME
    }}</a></span>
  </footer>
</template>

<script setup lang="ts">
import configPackage from '../../../package.json';
import { useLinks } from 'src/composables/UseLinks';
import { APP_CONST } from 'src/constants/App';

const links = useLinks();
</script>

<style scoped  src="@/assets/scss/components/footer.scss" />

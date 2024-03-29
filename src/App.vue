<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <Header />
  <main>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
  <Footer />
</template>

<style lang="scss">
#app {}
</style>

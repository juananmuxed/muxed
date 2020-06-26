<template>
  <div id="app">
    <muxed-terminal></muxed-terminal>
    <router-view/>
  </div>
</template>

<script>
import TerminalVue from './components/Terminal.vue'

export default {
  components:{
    'muxed-terminal': TerminalVue
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: auto;
  padding: 0;
}
</style>

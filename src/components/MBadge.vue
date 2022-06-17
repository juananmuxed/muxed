<template>
  <div class="m-badge" :class="[color, rounded ? 'rounded' : '']" :style="{ verticalAlign: align }">
    <span class="label" v-if="$slots.default || label">
      <slot v-if="!label"></slot>
      <template v-else>{{ label }}</template>
    </span>
  </div>
</template>

<script setup lang="ts">;
const props = defineProps({
  label: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: 'primary'
  },
  rounded: {
    type: Boolean,
    default: false
  },
  align: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss" src="@/assets/scss/components/badge.scss">
</style>
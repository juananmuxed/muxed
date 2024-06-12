<template>
  <div class="m-badge" :class="[color, rounded ? 'rounded' : '']" :style="{ verticalAlign: align }">
    <span v-if="$slots.default || label" class="label">
      <slot v-if="!label" />
      <template v-else>{{ label }}</template>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: 'primary',
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String,
    default: '',
  },
});
</script>

<style scoped lang="scss" src="@/assets/scss/components/badge.scss" />

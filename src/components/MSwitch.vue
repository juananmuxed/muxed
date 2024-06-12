<template>
  <label class="m-switch">
    <input v-model="model" type="checkbox">
    <span class="slider" />
    <span v-if="$slots.default || label" class="label">
      <slot v-if="!label" />
      <template v-else>{{ label }}</template>
    </span>
  </label>
</template>

<script setup lang="ts">

const model = defineModel({ type: Boolean, default: false });

defineProps({
  label: {
    type: String,
    default: '',
  },
});
</script>

<style scoped lang="scss" src="@/assets/scss/components/switch.scss" />

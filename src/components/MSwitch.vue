<template>
    <label class="m-switch">
        <input type="checkbox" @change="updateValue" :value="modelValue" :checked="modelValue">
        <span class="slider"></span>
        <span class="label" v-if="$slots.default || label">
            <slot v-if="!label"></slot>
            <template v-else>{{ label }}</template>
        </span>
    </label>
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: null
    },
    label: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.checked);
}
</script>

<style scoped lang="scss" src="@/assets/scss/components/switch.scss"></style>
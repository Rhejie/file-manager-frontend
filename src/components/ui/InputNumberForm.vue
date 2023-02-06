<template>
    <input type="number" @change="$emit('update:modelValue', $event.target.value)"
        class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm" />
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: 'InputTextForm',
    props: {
        modelValue: String,
    },
    setup() {

        return {

        }
    }
})
</script>
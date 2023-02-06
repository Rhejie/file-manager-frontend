<template>
    <input type="text" @change="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm" />
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: 'InputTextForm',
    props: {
        modelValue: String,
        placeholder: {
            type: String,
            default: 'Input Here'
        }
    },
    setup() {

        return {

        }
    }
})
</script>
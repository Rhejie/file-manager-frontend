<template>
    <input id="password"
        @change="$emit('update:modelValue', $event.target.value)"
        name="password" type="password"
        :placeholder="customPlaceholder"
        :class="[size == 'small' ? 'text-sm h-6': '','block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm']" />
        <span class="text-red-500 text-sm" v-if="errorStatus">{{errorStatus}}</span>
</template>
<script>
import { computed, defineComponent } from "vue";

export default defineComponent({
    name: "InputPasswordForm",
    props: {
        modelValue: String,
        error: String,
        placeholder: {
            type: String,
            default: 'Please input password'
        },
        type: {
            type: String,
            default: null
        }
    },
    setup(props) {
        const customPlaceholder = computed(() => props.placeholder)
        const errorStatus = computed(() => props.error)
        return {
            errorStatus,
            customPlaceholder: computed(() => props.placeholder),
            size: computed(() => props.type)
        }
    }  
})
</script>
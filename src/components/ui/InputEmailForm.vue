<template>
    <input id="email" name="email" type="email" 
        @change="$emit('update:modelValue', $event.target.value)"
        :placeholder="customPlaceholder"
        class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm" />
        <span class="text-red-500 text-sm" v-if="errorStatus">{{errorStatus}}</span>
</template>
<script>
import { computed, defineComponent } from "vue";

    export default defineComponent({
        name: 'InputEmailForm',
        props: {
            modelValue: String,
            error: String,
            placeholder: {
                type: String,
                default: 'Please input valid email address'
            }
        },
        setup(props) {
            const errorStatus = computed(() => props.error)

            return {
                errorStatus,
                customPlaceholder: computed(() => props.placeholder)
            }
        }
    })
</script>
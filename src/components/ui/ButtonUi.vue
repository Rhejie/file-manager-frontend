<template>
    <button type="button" @click="handleClick" class="flex w-full justify-center rounded-md border 
            border-transparent bg-gray-600 text-sm font-medium 
            text-white shadow-sm hover:bg-gray-700 focus:outline-none 
            focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            {{customLabel}}
    </button>
</template>
<script>
import { computed, defineComponent } from "vue";

export default defineComponent({
    name: "ButtonUi",
    props: {
        label: {
            type: String,
            default: "Load More"
        }
    },
    setup(props, {emit}) {
        const customLabel = computed(() => props.label)
        const handleClick = () => {
            emit('handleClick')
        }
        return {
            handleClick,
            customLabel
        }
    }
})
</script>
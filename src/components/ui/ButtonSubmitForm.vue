<template>
    <button type="button" 
        @click="handleClickSubmit()"
        class="flex w-full justify-center rounded-md border 
            border-transparent bg-gray-600 py-2 px-4 text-sm font-medium 
            text-white shadow-sm hover:bg-gray-700 focus:outline-none 
            focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
        {{customTitle}}        
    </button>
</template>
<script>
import { computed, defineComponent } from "vue";

    export default defineComponent({
        name: "ButtonSubmitForm",
        emits: ['handleClickSubmit'],
        props: {
            title: {
                type: String,
                default: 'Save'
            }
        },  
        setup (props, {emit}) {

            const customTitle = computed(() => props.title)

            const handleClickSubmit = () => {
                emit('handleClickSubmit')
            }

            return {
                handleClickSubmit,
                customTitle
            }
        }
    })
</script>
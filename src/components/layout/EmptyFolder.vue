<template>
    <div class="grid justify-items-center">
        <div class="grid justify-items-center">
            <FolderOpenIcon class="w-96 text-gray-300" />
            <span class="text-xl text-gray-500">This folder is empty.</span>
        </div>
    </div>
</template>
<script>
import { defineComponent } from "vue";

import { FolderOpenIcon } from "@heroicons/vue/solid"

export default defineComponent({
    name: "EmptyFolder",
    components: {
        FolderOpenIcon
    },
    setup() {
        return {

        }
    }
})
</script>
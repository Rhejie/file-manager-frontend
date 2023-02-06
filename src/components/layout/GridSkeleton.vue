<template>
    <div class="grid grid-rows-2 grid-flow-col gap-2 mt-2">
        <div v-for="o in 10" :key="o" class="border mr-2 border-gray-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div class="animate-pulse flex space-x-4">
                <div class="rounded-full bg-gray-700 h-10 w-10"></div>
                <div class="flex-1 space-y-6 py-1">
                    <div class="h-2 bg-gray-700 rounded"></div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                            <div class="h-2 bg-gray-700 rounded col-span-2"></div>
                            <div class="h-2 bg-gray-700 rounded col-span-1"></div>
                        </div>
                        <div class="h-2 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "GridSkeleton",
    setup() {
        return {

        }
    }
})
</script>
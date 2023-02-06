<script>
import { defineComponent } from "vue";


export default defineComponent({
    name: "UploadPage",
    components: {

    },
    setup() {
        return {

        }
    }
})
</script>
<template>
    <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white mt-4 shadow overflow-hidden">
                <div class="w-full">
                    <div class="md:flex bg-gray-100 p-2 w-full md:items-center md:justify-between">
                        <div class="min-w-0 flex-1">
                            <h2
                                class="text-2xl font-bold leading-7 text-gray-800 sm:truncate sm:text-3xl sm:tracking-tight">
                                Upload File</h2>

                            <div class="w-full">

                            </div>
                        </div>
                        <div class="mt-4 flex md:mt-0 md:ml-4">
                            <button type="button"
                                class="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800">Edit</button>
                            <button type="button"
                                class="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800">Publish</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
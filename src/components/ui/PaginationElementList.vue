<template>
    <nav class="flex items-center mt-2 justify-between border-t border-gray-200 px-4 sm:px-0  mb-40">
        <div class="-mt-px flex w-0 flex-1">
            <button @click="paginate.clickPreviousPage"
                :disable="!paginate.previous"
                :class="[ !paginate.previous ? 'cursor-not-allowed' : '']"
                class="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                <ArrowLeftIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                Previous
            </button>
        </div>
        <div class="hidden md:-mt-px md:flex">
            <a href="#"
                class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">1</a>
            <!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" -->
            <a href="#"
                class="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600"
                aria-current="page">2</a>
            <a href="#"
                class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">3</a>
            <span
                class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">...</span>
            <a href="#"
                class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">8</a>
            <a href="#"
                class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">9</a>
            <a href="#"
                class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">10</a>
        </div>
        <div class="-mt-px flex w-0 flex-1 justify-end">
            <button
                @click="paginate.clickNextPage"
                v-if="!paginate.next"
                :class="[ !paginate.next ? 'cursor-not-allowed' : '']"
                class="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Next
                <ArrowRightIcon class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            </button>
        </div>
    </nav>
</template>
<script>
import { computed, defineComponent, inject } from "vue";
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/solid'

    export default defineComponent({
        name: "PaginationElementList",
        components: {
            ArrowLeftIcon, ArrowRightIcon
        },
        setup () {
            const paginate = inject('paginate')

            const nextPage = computed(() => paginate.next)
            return {
                paginate,
                nextPage
            }
        }
    })
</script>
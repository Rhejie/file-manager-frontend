<template>
    <GridSkeleton v-if="loadingData" />

    <div v-if="!loadingData && f.length > 0" class=" w-full py-4 lg:max-w-8xl lg:px-2 mb-40">
        <h2 class="sr-only">Products</h2>

        <div
            
            :class="['grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-4 lg:gap-x-2', isClickPreview ? 'lg:grid-cols-4' : 'lg:grid-cols-6']"
            v-infinite-scroll="loadMore.clickNextPage" 
            :infinite-scroll-immediate-check="false"
            :infinite-scroll-disabled="disableScroll" 
            infinite-scroll-watch-disabled="disableScroll">
            <div v-for="file in f" :key="file.id" @click="handleClickFilePreview(file)"
                class="group relative flex flex-col overflow-hidden shadow-md rounded-lg border sm:h-90 border-gray-200 bg-white">
                <div class="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-40">

                    <img v-if="isPicture(file.mimetype)" :src="file.url ? file.url : file.url_path" :alt="file.name"
                        class="h-full w-full object-cover object-center sm:h-full sm:w-full" />
                    <component v-else :is="fileIcon(file.mimetype)"
                        class="mx-auto h-full w-full flex-shrink-0 text-indigo-300" aria-hidden="true" />
                </div>
                <div class="flex flex-1 flex-col space-y-2 p-4">
                    <h3 class="text-sm font-medium text-gray-900">
                        <a :href="file.href">
                            <span aria-hidden="true" class="absolute inset-0" />
                            {{ file.name }}
                        </a>
                    </h3>
                    <div class="flex flex-1 flex-col justify-end">
                        <p class="text-sm italic text-gray-500">Owner: {{ file.user.name }}</p>
                        <p class="text-base font-medium text-gray-900">File Size: {{ convertFileSizeToMB(file.filesize)
                        }}
                        </p>
                    </div>
                </div>
                <div class=" w-full">
                    <!-- <button type="button"
                                class="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span class="sr-only">Open options</span>
                                <DotsVerticalIcon class="w-5 h-5" aria-hidden="true" />
                            </button> -->
                    <DropdownOption class="mx-auto float-right mr-2 mb-2" :data="file" :type="'file'"  />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { useEmitter } from "@/composables/useEmitter";
import { computed, defineComponent, inject, ref } from "vue";
import GridSkeleton from "../layout/GridSkeleton.vue";
import {
    DocumentTextIcon, MusicNoteIcon,
} from '@heroicons/vue/solid'
// import ButtonUi from "@/components/ui/ButtonUi.vue"
import DropdownOption from "../files/DropdownOption.vue";

export default defineComponent({
    name: "WidgetFileGridView",
    props: {
        loading: Boolean,
        files: [],
        next: {
            type: String,
            default: null
        }
    },
    setup(props) {
        const loadMore = inject('loadMore')
        const loadingData = computed(() => props.loadingData)
        const f = computed(() => props.files)
        const emitter = useEmitter;
        const isClickPreview = ref(false)
        const nextLink = computed(() => props.next)

        const convertFileSizeToMB = (size) => {
            return (size / (1024 ** 2)).toFixed(2) + 'mb'
        }

        const handleClickFilePreview = (file) => {
            emitter.emit('SELECTED_DATA', {
                data: file,
                type: 'file'
            })
            isClickPreview.value = true;
        }

        const fileIcon = (mimetype) => {
            if (mimetype == 'mp3') {
                return MusicNoteIcon
            }
            return DocumentTextIcon;
        }

        const isPicture = (mimetype) => {
            if (mimetype == 'png') {
                return true
            }
            else if (mimetype == 'gif') {
                return true
            }
            else if (mimetype == 'jpg') {
                return true;
            }
            else if (mimetype == 'jpeg') {
                return true;
            }
            else {
                false
            }
        }

        return {
            loadingData,
            f,
            convertFileSizeToMB,
            handleClickFilePreview,
            isClickPreview,
            fileIcon,
            isPicture,
            loadMore,
            nextLink
        };
    },
    components: {
    GridSkeleton,
    // ButtonUi,
    DropdownOption
}
})
</script>
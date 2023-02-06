<template>

    <div class=" w-full py-4 lg:max-w-8xl lg:px-2 mb-40">
        <h2 class="sr-only">Products</h2>

        <div
            v-infinite-scroll="loadMore.clickNextPageFile" 
            :infinite-scroll-immediate-check="false"
            :infinite-scroll-disabled="disableScroll" 
            infinite-scroll-watch-disabled="disableScroll"
            :class="['grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-4 lg:gap-x-2', isClickPreview ? 'lg:grid-cols-4' : 'lg:grid-cols-6']">
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
                        <p class="text-base font-medium text-gray-900">File Size: {{ convertFileSizeToMB(file.filesize) }}</p>
                    </div>
                </div>
                <div class=" w-full">
                        <!-- <button type="button"
                            class="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span class="sr-only">Open options</span>
                            <DotsVerticalIcon class="w-5 h-5" aria-hidden="true" />
                        </button> -->
                        <DropdownOption class="mx-auto float-right mr-2 mb-2" :data="file" :type="'file'" :isFromMainPage="isFromMainPage"/>
                    </div>
            </div>
        </div>

        <GridSkeleton v-if="loadingData" />
    </div>
    <!-- <EmptyFolder v-else-if="!loadingData " /> -->
</template>
<script>
import { computed, defineComponent, inject, onMounted, ref } from "vue";
import {
    DocumentTextIcon,
} from '@heroicons/vue/solid'
import {
    MusicNoteIcon,
} from '@heroicons/vue/solid'
import { useEmitter } from "@/composables/useEmitter";
// import DropdownOptionVue from "./DropdownOption.vue";
import { useRouter } from "vue-router";
import GridSkeleton from "@/components/layout/GridSkeleton.vue"
import DropdownOption from "./DropdownOption.vue";
// import EmptyFolder from "@/components/layout/EmptyFolder.vue"
import {uniqBy} from 'lodash-es'

export default defineComponent({
    name: "FileGridView",
    components: {
    // DropdownOptionVue,
    GridSkeleton,
    DropdownOption
},
    props: {
        files: {
            type: Array,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        isFromMainPage: {
            type: Boolean,
            default: false,
        }
    },
    setup(props) {
        const emitter = useEmitter;
        const router = useRouter();
        const isClickPreview = ref(false)

        const loadMore = inject('loadMore')

        const fileIcon = (mimetype) => {
            if(mimetype == 'mp3') {
                return MusicNoteIcon
            }
            return DocumentTextIcon;
        }

        const handleClickFolder = (folder) => {
            emitter.emit('SELECTED_DATA', {
                data: folder,
                type: 'folder'
            })
        }

        const handleClickFilePreview = (file) => {
            emitter.emit('SELECTED_DATA', {
                data: file,
                type: 'file'
            })
            isClickPreview.value = true;
        }

        const handleOpenFolderClick = (folder) => {
            router.push({ name: "Open Folder", params: { id: folder.id } })
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

        const convertFileSizeToMB = (size) => {
            return (size / (1024 ** 2)).toFixed(2) + 'mb'
        }

        onMounted(() => {
            emitter.on('CLICK_PREVIEW', () => {
                isClickPreview.value = true;
            })


            emitter.on('CLOSE_SIDE_PREVIEW', () => {
                isClickPreview.value = false
            })
        })

        return {
            f: computed(() => {
                return uniqBy(props.files,function(item){
                    return item?.id
                })
            }),
            handleClickFolder,
            handleOpenFolderClick,
            loadingData: computed(() => props.loading),
            isPicture,
            fileIcon,
            handleClickFilePreview,
            isClickPreview,
            convertFileSizeToMB,
            loadMore
        }
    }
})
</script>
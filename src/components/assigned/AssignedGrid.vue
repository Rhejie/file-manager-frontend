<template>
    <section :class="['mt-8', fileNumber === 0 ? 'pb-16' : '']"
        aria-labelledby="gallery-heading">
        <h2 class="mt-0">Folders</h2>
        <ul role="list"
            v-infinite-scroll="loadMore.clickNextPage" 
            :infinite-scroll-immediate-check="false"
            :infinite-scroll-disabled="disableScroll" 
            infinite-scroll-watch-disabled="disableScroll"
            :class="['mt-3 grid grid-cols-1 gap-5 sm:gap-6 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 ', isClickPreview ? 'lg:grid-cols-3' : 'lg:grid-cols-4']">
            <li v-for="(folder, index) in f" @click="handleClickFolder(folder)"
                @dblclick="handleOpenFolderClick(folder)" :key="index"
                class="ease-out duration-300 col-span-1 cursor-pointer flex shadow-sm rounded-md">
                <div
                    :class="['border-t border-l border-b border-gray-200 bg-gray-200 flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md ']">
                    <FolderIcon class="w-10 mx-auto text-gray-500" />
                </div>
                <div
                    class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                    <div class="flex-1 px-4 py-4 text-sm truncate">
                        <button class="text-gray-900 font-medium hover:text-gray-600">{{ folder.name }}</button>
                    </div>
                    <div class="flex-shrink-0 pr-2">
                        <!-- <button type="button"
                            class="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span class="sr-only">Open options</span>
                            <DotsVerticalIcon class="w-5 h-5" aria-hidden="true" />
                        </button> -->
                        <DropdownOptionVue :data="folder" :type="'folder'" :fromAssignedPage="isFromAssignedPage" :permission="getPermission"/>
                    </div>
                </div>
            </li>
        </ul>
        <GridSkeleton v-if="loadingData" />
    </section>
</template>
<script>
import { computed, defineComponent, inject, ref } from "vue";
import {
    FolderIcon,
} from '@heroicons/vue/solid'
import { useEmitter } from "@/composables/useEmitter";
import DropdownOptionVue from "@/components/files/DropdownOption.vue";
import { useRouter } from "vue-router";
import GridSkeleton from "@/components/layout/GridSkeleton.vue"

export default defineComponent({
    name: "AssignedGrid",
    components: {
        FolderIcon,
        DropdownOptionVue,
        GridSkeleton,
    },
    props: {
        folders: {
            type: Array,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        fileLenght: null,
        fromAssignedPage: {
            type: Boolean,
            default: false,
        },
        permission: {
            type: String,
            default: 'read_write'
        }
    },
    setup(props) {
        const emitter = useEmitter;
        const loadMore = inject('loadMore');
        const router = useRouter();
        const fileNumber = computed(() => props.fileLenght)
        const isClickPreview = ref(false)
        const isFromAssignedPage = computed(() => props.fromAssignedPage)
        const getPermission = computed(() => props.permission)

        const handleClickFolder = (folder) => {
            console.log(folder, 'folder')
            
            
            emitter.emit('SELECTED_DATA', {
                data: folder,
                type: 'folder',
                assigned_status: !props.fromAssignedPage,
            })
            isClickPreview.value = true
            emitter.emit('CLICK_PREVIEW');
        }

        const handleOpenFolderClick = (folder) => {
            router.push({ name: "Assigned Folder", params: { id: folder.id } })
        }

        return {
            f: computed(() => props.folders),
            handleClickFolder,
            handleOpenFolderClick,
            loadingData: computed(() => props.loading),
            fileNumber,
            isFromAssignedPage,
            getPermission,
            isClickPreview,
            loadMore
        }
    }
})
</script>
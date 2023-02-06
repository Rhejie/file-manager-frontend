<template>
    <section :class="['mt-8', fileNumber === 0 ? 'pb-16' : '']"
        aria-labelledby="gallery-heading">
        <h2 class="mt-0">Folders</h2>
        <ul role="list"
            :class="['mt-3 grid grid-cols-1 gap-5 sm:gap-6 xs:grid-cols-1 sm:grid-cols-2 xs:grid-cols-2 md:grid-cols-2 ', isClickPreview ? 'lg:grid-cols-3' : 'lg:grid-cols-4']"
            v-infinite-scroll="loadMore.clickNextPage" 
            :infinite-scroll-immediate-check="false"
            :infinite-scroll-disabled="disableScroll" 
            infinite-scroll-watch-disabled="disableScroll">
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
                        <DropdownOptionVue :data="folder" :type="'folder'" :fromAssignedPage="isFromAssignedPage" :isFromMainPage="isFromMainPageData" :permission="getPermission"/>
                    </div>
                </div>
            </li>
            <!-- <li v-if="nextLink">
                <ButtonUi class="w-40 p-2" @handleClick="loadMore.clickNextPage" />
            </li> -->
        </ul>
        <GridSkeleton v-if="loadingData" />
    </section>
</template>
<script>
import { computed, defineComponent, inject, onMounted, ref } from "vue";
import {
    FolderIcon,
} from '@heroicons/vue/solid'
import { useEmitter } from "@/composables/useEmitter";
import DropdownOptionVue from "./DropdownOption.vue";
import { useRouter } from "vue-router";
import GridSkeleton from "@/components/layout/GridSkeleton.vue"
import { uniqBy } from "lodash-es"
// import ButtonUi from "../ui/ButtonUi.vue";

export default defineComponent({
    name: "GridView",
    components: {
    FolderIcon,
    DropdownOptionVue,
    GridSkeleton,
    // ButtonUi
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
        },
        isFromMainPage: {
            type: Boolean,
            default: false,
        },
        next: {
            type: Boolean,
            default: null
        }
    },
    setup(props) {
        const emitter = useEmitter;
        const router = useRouter();

        const loadMore = inject('loadMore')
        const fileNumber = computed(() => props.fileLenght)
        const isClickPreview = ref(false)
        const isFromAssignedPage = computed(() => props.fromAssignedPage)
        const getPermission = computed(() => props.permission)
        const isFromMainPageData = computed(() => props.isFromMainPage)

        const nextLink = computed(() => props.next)

        const handleClickFolder = (folder) => {
            
            console.log('folder', JSON.stringify(folder))
            emitter.emit('SELECTED_DATA', {
                data: folder,
                type: 'folder',
                assigned_status: !props.fromAssignedPage,
            })
            isClickPreview.value = true
            emitter.emit('CLICK_PREVIEW')
        }

        const handleOpenFolderClick = (folder) => {
            router.push({ name: "Open Folder", params: { id: folder.id } })
        }

        onMounted(() => {
            emitter.on('CLOSE_SIDE_PREVIEW', () => {
                isClickPreview.value = false
            })
        })

        return {
            f: computed(() => {
                return uniqBy(props.folders,function(e){
                    return e?.id
                })
            }),
            handleClickFolder,
            handleOpenFolderClick,
            loadingData: computed(() => props.loading),
            fileNumber,
            isFromAssignedPage,
            getPermission,
            isFromMainPageData,
            loadMore,
            nextLink,
            isClickPreview
        }
    }
})
</script>
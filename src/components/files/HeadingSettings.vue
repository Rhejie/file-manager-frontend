<template>
    <div class="w-full border-b bg-white shadow-md border-gray-200">
        <div class="h-16 flex flex-col justify-center">
            <div class="px-4 sm:px-6 lg:px-8">
                <div class="py-3 flex justify-between">
                    <!-- big screen -->
                    <div class="hidden sm:block" :key="refreshKey">
                        <div class="relative z-0 inline-flex shadow-sm rounded-md sm:shadow-none sm:space-x-3">
                            <span class="inline-flex sm:shadow-sm">
                                <button type="button" :disabled="!folder_id" @click="handleClickUpload"
                                    :class="[!folder_id ? 'hidden ': 'sm:inline-flex', ' items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 ']">
                                    <CloudUploadIcon class="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span>Upload File</span>
                                </button>
                                <button v-if="false" type="button" @click="handleCreateFolder" :disabled="!folder_id"
                                    :class="[!folder_id? 'cursor-not-allowed' : '', 'hidden sm:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10'] ">
                                    <FolderIcon class="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span>Upload Folder</span>
                                </button>
                                <button type="button" @click="handleCreateFolder" :disabled="isDisabled()"
                                    :class="[isDisabled()? 'cursor-not-allowed' : '', 'hidden rounded-r-md sm:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10'] ">
                                    <FolderAddIcon class="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span>Add Folder</span>
                                </button>
                            </span>

                            <!-- <span class="hidden lg:flex space-x-3">
                                <button type="button"
                                    class="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 ">
                                    <TrashIcon class="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span>Trash</span>
                                </button>
                                <button type="button"
                                    class="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 ">
                                    <CloudDownloadIcon class="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span>Download</span>
                                </button>
                                <button type="button"
                                    class="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 ">
                                    <FolderDownloadIcon class="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span>Move</span>
                                </button>
                            </span> -->
                            <div
                                class="hidden ml-6 bg-gray-100 border-gray-400 border p-0.5 rounded-lg items-center sm:flex">
                                <button type="button" @click="handleListType(true)"
                                    :class="isList ? 'bg-gray-600 text-white shadow-md' : ''"
                                    class="p-1.5 rounded-md text-gray-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                                    <ViewListIcon class="h-5 w-5" aria-hidden="true" />
                                    <span class="sr-only">Use list view</span>
                                </button>
                                <button type="button" @click="handleListType(false)"
                                    :class="!isList ? 'bg-gray-600 text-white shadow-md' : ''"
                                    class="ml-0.5 p-1.5 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                                    <ViewGridIconSolid class="h-5 w-5" aria-hidden="true" />
                                    <span class="sr-only">Use grid view</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- end big screen -->
                    <!-- mobile device -->
                    <div class="sm:hidden p-0.5 mx-auto rounded-lg items-center sm:flex">
                        <span class="inline-flex sm:shadow-sm">
                                <button type="button" :disabled="!folder_id" @click="handleClickUpload"
                                    :class="[!folder_id ? 'cursor-not-allowed ': '', '  sm:inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 ']">
                                    <CloudUploadIcon class="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span>Upload File</span>
                                </button>
                                <!-- <button type="button" @click="handleCreateFolder" :disabled="isDisabled()"
                                    :class="[!folder_id? 'cursor-not-allowed' : '', ' sm:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10'] ">
                                    <FolderIcon class="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span>Upload Folder</span>
                                </button> -->
                                <button type="button" @click="handleCreateFolderMobile" :disabled="isDisabled()"
                                    :class="[isDisabled()? 'cursor-not-allowed' : '', ' sm:inline-flex -ml-px rounded-r-md relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10'] ">
                                    <FolderAddIcon class="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span>Add Folder</span>
                                </button>
                            </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AddFolderModal />
    <RenameFileModal />
</template>
<script>
import { computed, defineComponent, onMounted, ref } from "vue";

import { useEmitter } from "@/composables/useEmitter";
import {
    // TrashIcon,
    // UserAddIcon,
    CloudUploadIcon,
    // CloudDownloadIcon,
    ViewGridIcon as ViewGridIconSolid,
    ViewListIcon,
    FolderAddIcon,
    FolderIcon
} from "@heroicons/vue/solid"
import { setListActive } from "@/composables/SetActiveNav";
import { useStore } from "vuex";
import AddFolderModal from "@/components/modal/AddFolderModal.vue"
import { useRoute } from "vue-router";
import RenameFileModal from "../modal/RenameFileModal.vue";

export default defineComponent({
    name: "HeadingSettings",
    components: {
    // TrashIcon,
    ViewGridIconSolid,
    // UserAddIcon,
    FolderAddIcon,
    CloudUploadIcon,
    // CloudDownloadIcon,
    ViewListIcon,
    AddFolderModal,
    FolderIcon,
    RenameFileModal
},
    setup() {

        const store = useStore();
        const route = useRoute();

        const folder_id = ref(0)

        const selectedData = ref({});
        const refreshKey = ref(0)
        const routeName = computed(() => route.name);

        const emitter = useEmitter;

        const handleListType = (status) => {
            setListActive(status);
        }

        const handleClickUpload = () => {
            emitter.emit('UPLOAD_FILE', true); 
        }

        const handleCreateFolder = () => {
            emitter.emit('ADD_FOLDER', folder_id.value)
        }

        const handleCreateFolderMobile = () => {
            emitter.emit('ADD_FOLDER_MOBILE', folder_id.value)
        }

        const isDisabled = () => {
            if(routeName.value == 'Assigned Files') {
                return true;
            }
            else if (routeName.value == 'Search All') {
                return true;
            }
            else if (routeName.value == 'Widget Page') {
                return true;
            }
            else if (routeName.value == 'Trash Files') {
                
                return true;

            }
            else if (routeName.value == 'Favorite Files') { 
                return true
            }
            else if (routeName.value == 'Recent Files') {
                return true;
            }
            else {
                return false
            }
        }

        onMounted(() => {
            emitter.on('FOLDER_ID', data => {
                folder_id.value = data
                refreshKey.value++
            })
        })
        

        return {
            handleListType,
            isList: computed(() => store.state.isList),
            handleCreateFolder,
            handleClickUpload,
            folder_id,
            selectedData,
            routeName,
            isDisabled,
            handleCreateFolderMobile
        }
    }
})
</script>
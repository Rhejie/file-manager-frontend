<template>
    <!-- desktop -->
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-10">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>
    
            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                <button type="button"
                                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                    @click="open = false">
                                    <span class="sr-only">Close</span>
                                    <XCircleIcon class="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div class="sm:flex w-full sm:items-start">
                                <div v-if="false"
                                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ArrowCircleRightIcon class="h-6 w-6 text-gray-600" aria-hidden="true" />
                                </div>
                                <div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                        <h2 class="text-xs text-gray-500">{{selectedFile.name}}</h2>
                                        <h2 class="text-gray-600">Move to: {{selectedFolder.name}}</h2>
                                    </DialogTitle>
                                    <div class="mt-2 w-full">
                                        <nav class="flex" v-if="path.length > 0" aria-label="Breadcrumb">
                                            <ol role="list" class="flex items-center space-x-4">
                                                <li v-for="p in path" @click="handleClickPath(p)" :key="p.path">
                                                    <div class="flex items-center">
                                                        <svg class="h-5 w-5 flex-shrink-0 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                            viewBox="0 0 20 20" aria-hidden="true">
                                                            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                                        </svg>
                                                        <span class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">{{p.name}}</span>
                                                    </div>
                                                </li>
                                            </ol>
                                        </nav>
                                        <div class="w-full overflow-y-auto h-96">
                                            <div v-loading="loading">
                                                <h2 class="text-sm font-medium text-gray-500">Folders</h2>
                                                <nav class="space-y-1" aria-label="Sidebar"
                                                    v-infinite-scroll="handleLoadMore" 
                                                    :infinite-scroll-immediate-check="false"
                                                    :infinite-scroll-disabled="disableScroll" 
                                                    infinite-scroll-watch-disabled="disableScroll">
                                                    <button v-for="folder in folders" :key="folder.id" @click="handleSelected(folder)" @dblclick="handleSelectFolder(folder)"
                                                        :class="[folder.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900', 'group w-full flex items-center px-3 py-2 text-sm font-medium rounded-md']"
                                                        :aria-current="folder.current ? 'page' : undefined">
                                                        <FolderIcon 
                                                            :class="[folder.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'flex-shrink-0 -ml-1 mr-3 h-6 w-6']"
                                                            aria-hidden="true" />
                                                        <span class="truncate">{{ folder.name }}</span>
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button type="button" :disabled="isSelectFolder"
                                    :class="[isSelectFolder ? 'cursor-not-allowed' : '']"
                                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                    @click="handleMoveFolderClick()">{{ "Move"}}</button>
                                <button type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="handleClickCancel">Cancel</button>
                                <button type="button"

                                    v-if="!isMainList"
                                    class="mt-3 inline-flex w-full mr-4 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="handleClickBack">Back</button>
                                <button type="button" v-if="mainDisplayId && !isFromMainPageData"
                                    class="mt-3 inline-flex w-full mr-4 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="handleClickMoveToMain()">Move to main</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <!-- mobile -->
    <TransitionRoot as="template" :show="isMobileModal">
        <Dialog as="div" class="relative z-10">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>
    
            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-full">
                            <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                <button type="button"
                                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                    @click="isMobileModal = false">
                                    <span class="sr-only">Close</span>
                                    <XCircleIcon class="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div class="sm:flex w-full sm:items-start">
                                <div v-if="false"
                                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ArrowCircleRightIcon class="h-6 w-6 text-gray-600" aria-hidden="true" />
                                </div>
                                <div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                        <h2 class="text-xs text-gray-500">{{selectedFile.name}}</h2>
                                        <h2 class="text-gray-600">Move to: {{selectedFolder.name}}</h2>
                                    </DialogTitle>
                                    <div class="mt-2 w-full">
                                        <nav class="flex" v-if="path.length > 0" aria-label="Breadcrumb">
                                            <ol role="list" class="flex items-center space-x-4">
                                                <li v-for="p in path"
                                                    @click="handleClickPath(p)" :key="p.path">
                                                    <div class="flex items-center">
                                                        <svg class="h-5 w-5 flex-shrink-0 text-gray-300"
                                                            xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                            viewBox="0 0 20 20" aria-hidden="true">
                                                            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                                        </svg>
                                                        <span
                                                            class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">{{p.name}}</span>
                                                    </div>
                                                </li>
                                            </ol>
                                        </nav>
                                        <div class="w-full overflow-y-auto h-96">
                                            <div v-loading="loading">
                                                <h2 class="text-sm font-medium text-gray-500">Folders</h2>
                                                <nav class="space-y-1" aria-label="Sidebar"
                                                    v-infinite-scroll="handleLoadMore" 
                                                    :infinite-scroll-immediate-check="false"
                                                    :infinite-scroll-disabled="disableScroll" 
                                                    infinite-scroll-watch-disabled="disableScroll">
                                                    <div v-for="folder in folders" :key="folder.id">
                                                        <button @click="handleSelected(folder)" @dblclick="handleSelectFolder(folder)"
                                                            :class="[folder.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900', 'group w-full flex items-center px-3 py-2 text-sm font-medium rounded-md']"
                                                            :aria-current="folder.current ? 'page' : undefined">
                                                            <FolderIcon
                                                                :class="[folder.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'flex-shrink-0 -ml-1 mr-3 h-6 w-6']"
                                                                aria-hidden="true" />
                                                            <span class="truncate">{{ folder.name }}</span>
                                                            <button @click="handleSelectFolder(folder)" class="sm:hidden absolute right-0 mr-4 bg-gray-100 px-2 text-gray-500 round-md">Open</button>
                                                        </button>
                                                    </div>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                
                                <button type="button" :disabled="isSelectFolder"
                                    :class="[isSelectFolder ? 'cursor-not-allowed' : '']"
                                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                    @click="handleMoveFolderClick()">{{"Move"}}</button>
                                <button type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="handleClickCancel">Cancel</button>
                                <button type="button" 
                                    v-if="!isMainList"
                                    class="mt-3 inline-flex w-full mr-4 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="handleClickBack">Back</button>
                                <button type="button" v-if="mainDisplayId && !isFromMainPageData"
                                    class="mt-3 inline-flex w-full mr-4 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="handleClickMoveToMain()">Move to main</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
<script>
import { computed, defineComponent, onMounted, ref, watch } from "vue";
// import VueDocPreview from 'vue-doc-preview'
import {
    Dialog, DialogPanel,
    DialogTitle,  TransitionChild, TransitionRoot } from '@headlessui/vue'
import {  XCircleIcon,  ArrowCircleRightIcon} from "@heroicons/vue/solid"
import { useEmitter } from "@/composables/useEmitter";
import { fetchById, fetchWithPaginate, store } from "@/composables/resource_service";
import { FolderIcon } from '@heroicons/vue/solid'
import { useStore } from "vuex";

export default defineComponent({
    name: "MoveModal", 
    components: {
    // VueDocPreview,
    DialogPanel,
    DialogTitle,
    Dialog,
    TransitionChild,
    TransitionRoot,
    XCircleIcon,
    ArrowCircleRightIcon,
    FolderIcon,
},
    props: {
        fileUrl: null,
        fileType: null,
    },  
    setup (props) {
        const storeVuex = useStore();
        const emitter = useEmitter;
        const type = ref('')
        const url = computed(() => props.fileUrl)
        const open = ref(false)
        const selectedFile = ref({})
        const fileType = ref('')
        const folder_id = ref(0);
        const loading = ref(false);
        const folders = ref([])
        const path = ref([]);
        const loadingPath = ref(false);
        const selectedFolder = ref({});
        const isMobileModal = ref(false)
        const isFromMainPageData = ref(false)
        const tempFolders = ref([]);
        const mainDisplayId = computed(() => storeVuex.state.mainDisplayId);
        const isSelectFolder = computed(() => {
            if(selectedFolder.value && selectedFolder.value.id) {
                return false
            }
            else {
                return true
            }
        })

        const params = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })

        const paramsSelectedFolder = ref({
            pageSize: 1000,
            page: 1,
            search: ''
        })

        const nextPageSelectedFolder = ref(null)
        const isMainList = ref(true)

        const next = ref(null)

        const fetchFolders = async () => {
            loading.value = true
            isMainList.value = true
            const { load, data, nextPage } = fetchWithPaginate(params.value, '/file-manager/folder/list');
            await load();

            folders.value = data.value.folders.data
            if(fileType.value == 'folder') {
                folders.value = folders.value.filter((folder) => folder.id != selectedFile.value.id);
            }
            next.value = nextPage.value
            
            loading.value = false
            path.value = []
            selectedFolder.value = {}
        }

        const handleLoadMore = () => {
            if(next.value) {
                params.value.page = params.value.page + 1
            }
            // else if (!isMainList.value) {
            //     if (nextPageSelectedFolder.value) {
            //         paramsSelectedFolder.value.page = paramsSelectedFolder.value.page + 1
            //     }
            // }
        }

        const handleSelectFolder = async (folder) => {
            next.value = null
            loading.value = true;
            isMainList.value = false
            console.log(folder, 'check')
            folder_id.value = fileType.value == 'folder' ? folder.id : folder.folder_id;
            const { load, data, nextPage } = fetchWithPaginate(paramsSelectedFolder.value, `/file-manager/folder/folders/${folder.id}`)
            await load();
            loading.value = false;
            folders.value = data.value.data
            nextPageSelectedFolder.value = nextPage.value

            if (fileType.value == 'folder') {
                folders.value = folders.value.filter((folder) => folder.id != selectedFile.value.id);
            }
            await checkPath();
        }

        const handleClickPath = (folder) => {
            let index = path.value.findIndex((p) => p.id == folder.id);
            if(index == 1) {
                console.log('asd')
            }
            
        }

        const checkPath = async () => {
            loadingPath.value = true;
            const { data, load } = fetchById('/file-manager/folder/check-path', folder_id.value)
            await load();
            path.value = data.value.path
            loadingPath.value = false;
        }

        const handleSelected = (folder) => {
            folders.value = folders.value.map((f) => {
                if(f.id == folder.id) {
                    f.current = true;
                } 
                else {
                    f.current = false;
                }
                return f;
            })

            selectedFolder.value = folder
        }

        const handleClickCancel = () => {
            open.value = false
            isMobileModal.value = false
            selectedFolder.value = {}
        }

        const handleMoveFolderClick = async () => {
            if(fileType.value == "folder") {
                let form = {
                    parent_id: selectedFolder.value.id,
                    folder_id: selectedFile.value.id
                }
                const { data, errorValue, post } = store('/file-manager/folder/move', form);
                await post(); 
                console.log('Error in moving file', errorValue.value);
                if (!errorValue.value) {
                    emitter.emit('MOVED_FOLDER', data.value)
                    open.value = false
                    isMobileModal.value = false
                    emitter.emit('NOTIFICATION', {
                        message: 'Successfully moved',
                        type: "success",
                        mode: 'store'
                    })
                }
            }
            else {
                let form = {
                    file_id: selectedFile.value.id,
                    folder_id: selectedFolder.value.id
                }
                const { data, errorValue, post } = store('/file-manager/file/move', form);
                await post();
                console.log('Error in moving file', errorValue.value);
                if(!errorValue.value) {
                    emitter.emit('MOVED_FILE', data.value)
                    open.value = false
                    isMobileModal.value = false
                    emitter.emit('NOTIFICATION', {
                        message:  'Successfully moved',
                        type: "success",
                        mode: 'store'
                    })
                }
            }
            
        }

        const handleClickMoveToMain = async () => {
            console.log('move')
            if (fileType.value == "folder") {
                let form = {
                    parent_id: storeVuex.state.mainDisplayId,
                    folder_id: selectedFile.value.id
                }
                const { data, errorValue, post } = store('/file-manager/folder/move', form);
                await post();
                console.log('Error in moving file', errorValue.value);
                if (!errorValue.value) {
                    emitter.emit('MOVED_FOLDER', data.value)
                    open.value = false
                    isMobileModal.value = false
                    // emitter.emit('NOTIFICATION', {
                    //     message: 'Successfully moved',
                    //     type: "success",
                    //     mode: 'store'
                    // })
                }
            }
            else {
                let form = {
                    file_id: selectedFile.value.id,
                    folder_id: storeVuex.state.mainDisplayId
                }
                const { data, errorValue, post } = store('/file-manager/file/move', form);
                await post();
                console.log('Error in moving file', errorValue.value);
                if (!errorValue.value) {
                    emitter.emit('MOVED_FILE', data.value)
                    open.value = false
                    isMobileModal.value = false
                }
            }
        }

        const handleClickBack = () => {
            if(path.value.length == 1) {
                fetchFolders();
            }
            else {
                fetchFolders();
            }
        }

        watch(params.value, async () => {
            tempFolders.value = folders.value
            await fetchFolders()
            folders.value.forEach(file => {
                tempFolders.value.push(file)
            })

            folders.value = tempFolders.value
        });

        watch(paramsSelectedFolder.value, async () => {
            tempFolders.value = folders.value
            await handleSelectFolder()
            folders.value.forEach(file => {
                tempFolders.value.push(file)
            })

            folders.value = tempFolders.value
        })

        onMounted( () => {
            emitter.on('MOVE_FILE', async ({ file, file_type, isMobile }) => {
                if(isMobile) {
                    isMobileModal.value = isMobile;
                }
                else {
                    open.value = true;
                }
                selectedFile.value = file;
                fileType.value = file_type;
                selectedFolder.value = {}
                await fetchFolders();
            })
            emitter.on('FOLDER_ID', data => {
                mainDisplayId.value = data
            })

            emitter.on('IS_FROM_MAIN_PAGE', data => {
                isFromMainPageData.value = data
            })
            
        })
        return {
            type,
            url,
            open,
            folder_id,
            folders,
            loading,
            selectedFile,
            handleSelectFolder,
            path,
            loadingPath,
            handleClickPath,
            handleSelected,
            selectedFolder,
            handleClickCancel,
            isSelectFolder,
            handleMoveFolderClick,
            handleClickBack,
            isMobileModal,
            mainDisplayId,
            handleClickMoveToMain,
            isFromMainPageData,
            next,
            handleLoadMore,
            isMainList
        }
    }
})
</script>
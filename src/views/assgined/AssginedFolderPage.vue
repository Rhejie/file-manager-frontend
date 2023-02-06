<template>
    <div class="flex-1 overflow-y-auto h-screen">
        <nav v-if="path.length > 0" class="flex border-b border-gray-200 bg-white" aria-label="Breadcrumb">
            <ol role="list" class=" flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8">
            <li class="flex">
                <div class="flex items-center">
                <router-link to="/files/assign"  class="text-gray-400 hover:text-gray-500">
                    <HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span class="sr-only">Home</span>
                </router-link>
                </div>
            </li>
            <li v-for="page in path" :key="page.series" class="flex">
                <div class="flex items-center">
                <svg class="h-full w-6 flex-shrink-0 text-gray-200" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>
                <router-link :to="{ name: 'Assigned Folder', params: { id : page.id }}" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700" :aria-current="page.current ? 'page' : undefined">{{ page.name }}</router-link>
                </div>
            </li>
            </ol>
        </nav>
        <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <AssignedGrid v-if="!isList" :folders="folders" :file-length="files.length" :loading="loadingFolders" :fromAssignedPage="true" :permission="assignedFolderInfo.permission"  />
            <AssignedList v-else :folders="folders" :loading="loadingFolders" :fileLenght="files.length" :fromAssignedPage="true" :permission="assignedFolderInfo.permission" />
            <AssignedFileGrid v-if="!isList" :files="files" :loading="loadingFiles" :fromAssignedPage="true" :permission="assignedFolderInfo.permission" />
            <AssignedFileList v-else-if="isList" :files="files" :loading="loadingFiles" :fromAssignedPage="true" :permission="assignedFolderInfo.permission" />
            <EmptyFolder v-if="!isList && folders.length === 0 && files.length === 0 && !loadingFolders && !loadingFiles" />
        </div>
    </div>
</template>
<script>
import { fetchById, fetchWithPaginate } from "@/composables/resource_service";
import { useEmitter } from "@/composables/useEmitter";
import { computed, defineComponent, onMounted, provide, ref, watch } from "vue";
import { useStore } from "vuex";
// import GridView from "@/components/files/GridView.vue"
// import ListView from "@/components/files/ListView.vue";
// import FileGridView from "@/components/files/FileGridView.vue";
import EmptyFolder from "@/components/layout/EmptyFolder.vue";
import {
    HomeIcon,
} from '@heroicons/vue/solid'
import AssignedGrid from "@/components/assigned/AssignedGrid.vue";
import AssignedList from "@/components/assigned/AssignedList.vue"
import AssignedFileGrid from "../../components/assigned/AssignedFileGrid.vue"
import AssignedFileList from "@/components/assigned/AssignedFileList.vue";
import { setTitle } from "@/composables/title_service";
import { useRouter } from "vue-router";

export default defineComponent({
    name: "AssginedFolderPage",
    components: {
    // GridView,
    // ListView,
    // FileGridView,
    EmptyFolder,
    HomeIcon,
    AssignedGrid,
    AssignedList,
    AssignedFileGrid,
    AssignedFileList
},
    props: {
        id: null,
    },
    setup(props) {
        const loadingFolders = ref(false);
        const router = useRouter();
        const emitter = useEmitter;
        const store = useStore();
        const loadingFiles = ref(false);
        const folders = ref([]);
        const files = ref([]);
        const path = ref([])

        const paramsFolders = ref({
            pageSize: 50,
            page: 1,
            search: ''
        });

        const tempFolders = ref([])

        const nextPageFolder = ref(null)

        const paramsFiles = ref({
            pageSize: 50,
            page: 1,
            search: ''
        });

        const tempFiles = ref([])

        const nextPageFile = ref(null)

        const isList = computed(() => store.state.isList)

        const folder_id = computed(() => props.id)

        const isUpload = ref(false);

        const assignedFolderInfo = computed(() => {
            if(path.value.length > 0) {
                return path.value[0]
            }
            else {
                return {}
            }
        })

        const handleLoadMoreFolder = () => {
            if(!nextPageFolder.value) return
            paramsFolders.value.page = paramsFolders.value.page + 1
        }

        const handleLoadMoreFile = () => {
            if(!nextPageFile.value) return
            paramsFiles.value.page = paramsFiles.value.page + 1
        }

        const loadFolders = async () => {
            loadingFolders.value = true;
            const { load, data, nextPage } = fetchWithPaginate(paramsFolders.value, `/user/assigned/folders/${folder_id.value}`)
            await load();
            loadingFolders.value = false;
            folders.value = data.value.data;
            nextPageFolder.value = nextPage.value
        }

        const loadFiles = async () => {
            loadingFiles.value = true
            const { load, data, nextPage } = fetchWithPaginate(paramsFiles.value, `/user/assigned/files/${folder_id.value}`)
            await load();
            files.value = data.value.data;
            loadingFiles.value = false;
            nextPageFile.value = nextPage.value
        }

        const checkPath = async () => {
            const {data, load} = fetchById('/user/assigned/check-path', folder_id.value)
            await load();
            path.value = data.value
        }

        provide('loadMore', {
            clickNextPage: handleLoadMoreFolder,
            clickNextPageFile: handleLoadMoreFile,
        })

        onMounted(async () => {
            await loadFolders();
            await loadFiles();
            await checkPath();


            setTitle(router.currentRoute.value.name);
            console.log('folder_id', folder_id.value)
            emitter.emit('FOLDER_ID', folder_id.value)
            emitter.on('NEW_FOLDER', data => {
                folders.value.unshift(data)
            })

            emitter.on('UPDATED_FOLDER', (data) => {
                if (data && data.id) {
                    folders.value.map(folder => {
                        if (data.id == folder.id) {
                            for (let key in data) {
                                folder[key] = data[key];
                            }
                        }

                        return folder;
                    })
                }
            })

            emitter.on('UPLOAD_FILE', data => {
                isUpload.value = data;
            })

            emitter.on('NEW_FILE', data => {
                files.value.unshift(data);
            })
            emitter.on('UNDO_FILE', data => {
                const index = files.value.findIndex(file => file.id = data.file_id)
                files.value.splice(index, 1);
            })
        })

        watch(paramsFolders.value, async () => {
            tempFolders.value = folders.value
            await loadFolders()
            folders.value.forEach(file => {
                tempFolders.value.push(file)
            })

            folders.value = tempFolders.value
        })

        watch(paramsFiles.value, async () => {
            tempFiles.value = files.value
            await loadFiles()
            files.value.forEach(file => {
                tempFiles.value.push(file)
            })

            files.value = tempFiles.value
        })

        watch(folder_id, async () => {
            isUpload.value = false;
            folders.value = [];
            files.value = [];

            emitter.emit('FOLDER_ID', folder_id.value)
            await loadFolders();
            await loadFiles();
            await checkPath();
        })

        return {
            folder_id,
            isList,
            folders,
            loadingFolders,
            isUpload,
            files,
            path,
            assignedFolderInfo,
            loadingFiles
        }
    }
})
</script>
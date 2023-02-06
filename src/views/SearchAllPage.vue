<template>
    <div class=" max-w-8xl w-full mx-auto mb-20">
        <nav class="flex border-b border-gray-200 bg-white" v-if="false" aria-label="Breadcrumb">
            <ol role="list" class=" flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8">
                <li class="flex">
                    <div class="flex items-center">
                        <router-link to="/files/assign" class="text-gray-400 hover:text-gray-500">
                            <HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                            <span class="sr-only">Home</span>
                        </router-link>
                    </div>
                </li>
                <li v-for="page in path" :key="page.series" class="flex">
                    <div class="flex items-center">
                        <svg class="h-full w-6 flex-shrink-0 text-gray-200" viewBox="0 0 24 44" preserveAspectRatio="none"
                            fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                        </svg>
                        <router-link :to="{ name: 'Assigned Folder', params: { id : page.id }}"
                            class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                            :aria-current="page.current ? 'page' : undefined">{{ page.name }}</router-link>
                    </div>
                </li>
            </ol>
        </nav>
        <main class="flex-1 mt-2 mx-auto px-4 sm:px-6 lg:px-8 overflow-y-auto h-screen">
            <div
                class=" container w-full flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-300">
                <div>
    
                    <h4 class="text-2xl font-bold leading-tight text-gray-700">Search Results</h4>
                </div>
            </div>
            <!-- assigned files -->
            <div v-if="modelType == 'Assigned' && fileType == 'file'">
                <GridSkeleton v-if="loadingAssignedFiles" />
                <AssignedGridView v-if="!isList && assignedFiles.length > 0" :assignedFiles="assignedFiles" :type="'file'" />
                <AssignedListView v-else-if="isList && assignedFiles.length > 0" :loadingFiles="loadingAssignedFiles"
                    :assignedFiles="assignedFiles" :type="'file'" />
                <EmptyFolder v-if="!isList && assignedFiles.length === 0 && !loadingAssignedFiles && !loadingAssignedFiles && !loadingAssignedFolders" />
            </div>
            <!-- assigned folders -->
            <div v-else-if="modelType == 'Assigned' && fileType == 'folder'">
                <GridSkeleton v-if="loadingAssignedFolders" />
                <AssignedGridView v-if="!isList && assignedFolders.length > 0 && !loadingAssignedFolders" :assignedFiles="assignedFolders" />
                <AssignedListView v-else-if="isList && assignedFolders.length > 0 && !loadingAssignedFolders" :loadingFolders="loadingAssignedFolders"
                    :assignedFiles="assignedFolders" />
                <EmptyFolder v-if="!isList && assignedFolders.length === 0 && !loadingAssignedFiles && !loadingAssignedFiles && !loadingAssignedFolders" />
            </div>
            <!-- files -->
            <div v-else-if="modelType == 'File' && fileType == 'file'">
                <GridSkeleton v-if="loadingFiles" />
                <FileGridView v-if="!isList && files.length > 0" :files="files" :loading="loadingFiles" />
                <FileListView v-else-if="isList &&  files.length > 0" :files="files" :loading="loadingFiles" />
                <EmptyFolder v-if="!islist && files.length === 0 && !loadingFiles" />
            </div>
            <div v-else>
                <GridSkeleton v-if="loading" />
                <GridView v-if="!isList && folders.length > 0" :folders="folders" :fileLenght="0"
                    :loading="loading" />
                <ListView v-else-if="isList &&  folders.length > 0" :folders="folders" :fileLenght="0"
                    :loading="loading" />
            </div>
        </main>
    </div>
</template>
<script>
import { fetchWithPaginate } from "@/composables/resource_service";
import { computed, defineComponent, onMounted, provide, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AssignedGridView from "@/components/assigned/AssignedGridView.vue";
import AssignedListView from "@/components/assigned/AssignedListView.vue";
import EmptyFolder from "@/components/layout/EmptyFolder.vue";
import { useStore } from "vuex";
import GridSkeleton from "@/components/layout/GridSkeleton.vue";
import {
    HomeIcon,
} from '@heroicons/vue/solid'
import FileGridView from "@/components/files/FileGridView.vue";
import FileListView from "@/components/files/FileListView.vue";
import GridView from "@/components/files/GridView.vue";
import ListView from "@/components/files/ListView.vue";

export default defineComponent({
    name: "SearchAllPage",
    components: { AssignedGridView, 
        AssignedListView, 
        EmptyFolder,
        GridSkeleton, 
        HomeIcon, 
        FileGridView, 
        FileListView, GridView, ListView },
    setup() {
        const route = useRoute();
        const store = useStore();
        const fileType = ref("");
        const modelType = ref("");
        const query = ref("");
        const file_id = ref("");
        const assignedFiles = ref([]);
        const loadingAssignedFiles = ref(false);
        const loadingAssignedFolders = ref(false);
        const assignedFolders = ref([])
        const folder_id = ref('')
        const path = ref([])
        const loadingFiles = ref(false);
        const files = ref([])
        const loading = ref(false);
        const folders = ref([]);
        const paramsFiles = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })
        const tempFiles = ref([])
        const nextPageFiles = ref(null)


        const loadAssingedFiles = async () => {
            loadingAssignedFiles.value = true;
            const params = {
                search: query.value,
            };
            const { load, data } = fetchWithPaginate(params, `/user/assigned/files`);
            await load();
            assignedFiles.value = data.value;
            loadingAssignedFiles.value = false;
        }

        const loadAssingedFolders = async () => {
            loadingAssignedFolders.value = true;
            const params = {
                search: query.value,
            }
            const { load, data } = fetchWithPaginate(params, `/user/assigned/folders`);
            await load();
            assignedFolders.value = data.value;
            loadingAssignedFolders.value = false;
        }

        const loadFiles = async () => {
            
            const { load, data, nextPage } = fetchWithPaginate(paramsFiles.value, `/file-manager/file/files/${folder_id.value}`)
            await load();
            files.value = data.value.data;
            nextPageFiles.value = nextPage.value
            loadingFiles.value = false;
        }

        const fetchFolders = async () => {
            loading.value = true
            const params = {
                search: query.value
            }
            const { load, data } = fetchWithPaginate(params, '/file-manager/folder/search-folder');
            await load();

            folders.value = data.value
            loading.value = false
        }

        const handleClickloadMore = () => {

        }
        const handleClickLoadMoreFIle = () => {
            if (nextPageFiles.value) {
                paramsFiles.value.page = paramsFiles.value.page + 1
            }
        }

        provide('loadMore', {
            clickNextPage: handleClickloadMore,
            clickNextPageFile: handleClickLoadMoreFIle,
        })

        watch(route, async () => {
            fileType.value = route.query.file_type;
            modelType.value = route.query.type;
            query.value = route.query.name;
            file_id.value = route.query.id;
            folder_id.value = route.query.folder_id
            paramsFiles.value.search = query.value
            if (modelType.value === "Assigned") {
                if (fileType.value === "file") {
                    await loadAssingedFiles();
                }
                else {
                    await loadAssingedFolders();
                }
            }
            else if (modelType.value === 'File') {
                await loadFiles();
            }
            else {
                console.log('asdsd')
                await fetchFolders();
            }
        })

        watch(paramsFiles.value, async () => {
            tempFiles.value = files.value
            await loadFiles()
            files.value.forEach(file => {
                tempFiles.value.push(file)
            })

            files.value = tempFiles.value
        })


        onMounted(async () => {
            fileType.value = route.query.file_type;
            modelType.value = route.query.type;
            query.value = route.query.name;
            file_id.value = route.query.id;
            folder_id.value = route.query.folder_id
            paramsFiles.value.search = query.value
            if (modelType.value === "Assigned") {
                if(fileType.value === "file") {
                    await loadAssingedFiles();
                }
                else {
                    await loadAssingedFolders();
                }
            }
            else if(modelType.value === 'File') {
                await loadFiles();
            }
            else {
                console.log('asdsd')
                await fetchFolders();
            }
        });
        return {
            fileType,
            file_id,
            modelType,
            query,
            assignedFiles,
            loadingAssignedFiles,
            isList: computed(() => store.state.isList),
            assignedFolders,
            loadingAssignedFolders,
            path,
            folder_id,
            loadingFiles,
            files,
            folders,
            loading
        };
    },
    
})
</script>
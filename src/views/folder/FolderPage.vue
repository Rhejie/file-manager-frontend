<template>
    <div class="flex-1 overflow-y-auto h-screen">
        <nav v-if="!loadingPath" class="flex border-b border-gray-200 bg-white" aria-label="Breadcrumb">
            <ol role="list" class=" flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8">
            <li class="flex">
                <div class="flex items-center">
                <router-link :to="{ name: 'All Files'}" class="text-gray-400 hover:text-gray-500">
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
                <router-link :to="{ name: 'Open Folder', params: { id : page.id }}" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700" :aria-current="page.current ? 'page' : undefined">{{ page.name }}</router-link>
                </div>
            </li>
            </ol>
        </nav>
        <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <Transition name="slide-fade">
                <SuccessAlert v-if="showSuccessAlert" class="mt-2" @handleClickClose="handleClickClose" :message="alertMessage" />
            </Transition>
            <GridView v-if="!isList" :folders="folders" :fileLenght="files.length" :loading="loadingFolders" :isFromMainPage="false"/>
            <ListView v-else :folders="folders" :fileLenght="files.length" :loading="loadingFolders" :isFromMainPage="false"/>
            <FileGridView v-if="!isList" :files="files" :loading="loadingFiles" :isFromMainPage="false"/>
            <FileListView v-else-if="isList" :files="files" :loading="loadingFiles" :isFromMainPage="false"/>
            <EmptyFolder v-if="folders.length === 0 && files.length === 0 && !loadingFolders && !loadingFiles" />
        </div>
    </div>
</template>
<script>
import { fetchById, fetchWithPaginate } from "@/composables/resource_service";
import { useEmitter } from "@/composables/useEmitter";
import { computed, defineComponent, onMounted, provide, ref, watch } from "vue";
import { useStore } from "vuex";
import GridView from "@/components/files/GridView.vue"
import ListView from "@/components/files/ListView.vue";
import FileGridView from "@/components/files/FileGridView.vue";
import EmptyFolder from "@/components/layout/EmptyFolder.vue";
import FileListView from "@/components/files/FileListView.vue";
import {
    HomeIcon,
} from '@heroicons/vue/solid'
import SuccessAlert from "@/components/ui/SuccessAlert.vue";
import { setTitle } from "@/composables/title_service";
import { useRouter } from "vue-router";

export default defineComponent({
    name: "FolderPage",
    components: {
    GridView,
    ListView,
    FileGridView,
    EmptyFolder,
    FileListView,
    HomeIcon,
    SuccessAlert
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

        const isList = computed(() => store.state.isList)

        const folder_id = computed(() => props.id)

        const isUpload = ref(false);

        const loadingPath = ref(true)

        const path = ref([]);

        const paramsFiles = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })

        const paramsFolders = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })

        const nextPageFolder = ref(null)

        const tempFiles = ref([]);
        const tempFolders = ref([]);

        const nextPageFile = ref(null)

        const showSuccessAlert = ref(false);
        const alertMessage = ref('')

        const handleClickloadMoreFiles = () => {
            if(nextPageFile.value) {
                paramsFiles.value.page = paramsFiles.value.page + 1
            }
        }

        const handleCLickLoadMoreFolder = () => {
            if(nextPageFolder.value) {
                paramsFolders.value.page = paramsFolders.value.page + 1
            }
        }

        provide('loadMore', {
            clickNextPageFile: handleClickloadMoreFiles,
            clickNextPage: handleCLickLoadMoreFolder,
        })

        const loadFolders = async () => {
            loadingFolders.value = true;
            const { load, data, nextPage } = fetchWithPaginate(paramsFolders.value, `/file-manager/folder/folders/${folder_id.value}`)
            await load();
            loadingFolders.value = false;
            nextPageFolder.value = nextPage.value
            folders.value = data.value.data

            if(!nextPageFolder.value) {
                await loadFiles();
            }
        }

        const loadFiles = async () => {
            loadingFiles.value = true
            const { load, data, nextPage } = fetchWithPaginate(paramsFiles.value, `/file-manager/file/files/${folder_id.value}`)
            await load();
            files.value = data.value.data;
            nextPageFile.value = nextPage.value
            loadingFiles.value = false;
        }
        const checkPath = async () => {
            loadingPath.value = true;
            const {data, load} = fetchById('/file-manager/folder/check-path', folder_id.value)
            await load();
            path.value = data.value.path
            loadingPath.value = false;
            store.commit('setMainDisplayId', data.value.main_folder_id)
        }

        const handleClickClose = () => {
            showSuccessAlert.value = false
        }

        onMounted(async () => {
            await loadFolders();
            // await loadFiles();
            await checkPath();

            setTitle(router.currentRoute.value.name);
            console.log('folder_id', folder_id.value)
            emitter.emit('FOLDER_ID', folder_id.value)
            emitter.on('NEW_FOLDER', data => {
                folders.value.unshift(data)
                alertMessage.value = 'Successfully create a folder'
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
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
                    alertMessage.value = 'Successfully update folder'
                    showSuccessAlert.value = true
                    setTimeout(() => {
                        showSuccessAlert.value = false
                    }, 3000)
                }
            })

            emitter.on('UPDATED_FILE', data => {
                if(data && data.id) {
                    files.value.map(file => {
                        if(data.id == file.id) {
                            for(let key in data) {
                                file[key] = data[key];
                            }
                        }

                        return files;
                    })
                    alertMessage.value = 'Successfully update file'
                    showSuccessAlert.value = true
                    setTimeout(() => {
                        showSuccessAlert.value = false
                    }, 3000)
                }
            })

            emitter.on('UPLOAD_FILE', data => {
                isUpload.value = data;
            })

            emitter.on('NEW_FILE', data => {
                files.value.unshift(data);
            })


            emitter.emit('IS_FROM_MAIN_PAGE', false)
            emitter.on('UNDO_FILE', data => {
                const index = files.value.findIndex(file => file.id = data.file_id)
                files.value.splice(index, 1);
            })

            emitter.on('MOVED_FILE', data => {
                let index = files.value.findIndex(file => file.id == data.id);
                files.value.splice(index, 1);
                if(data.folder_id == folder_id.value) {
                    files.value.unshift(data);
                }
            })

            emitter.on('MOVED_FOLDER', data => {
                let index = folders.value.findIndex(folder => folder.id == data.id);
                folders.value.splice(index, 1);
            })

            emitter.on('DELETED_FOLDER', data => {
                let _index = folders.value.findIndex(folder => folder.id == data.id);
                folders.value.splice(_index, 1);
                alertMessage.value = 'Successfully deleted folder'
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })

            emitter.on('DELETED_FILE', data => {
                let _index = files.value.findIndex(folder => folder.id == data.id);
                files.value.splice(_index, 1);
                alertMessage.value = 'Successfully deleted file'
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })

            emitter.on('ADD_FAVORITE_FILE', ({ type, data, favorite }) => {
                console.log('favorite', favorite)
                if (type == 'folder') {
                    folders.value.map(folder => {
                        if (data.id == folder.id) {
                            for (let key in data) {
                                folder[key] = data[key];
                            }
                        }

                        return folder;
                    })
                }
                else {
                    files.value.map(file => {
                        if (data.id == file.id) {
                            for (let key in data) {
                                file[key] = data[key];
                            }
                        }

                        return file;
                    })
                }
                alertMessage.value = 'Successfully add to favorites'
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })

            emitter.on('REMOVE_FAVORITE', ({ type, data }) => {
                if (type == 'folder') {
                    console.log('data', data)
                    let index = folders.value.findIndex(folder => {
                        if (folder.favorite) {
                            return folder.favorite.id == data.id
                        }
                    });
                    folders.value[index].favorite = null
                }
                else if (type == 'file') {
                    let index = files.value.findIndex(folder => {
                        if (folder.favorite) {
                            return folder.favorite.id == data.id
                        }
                    });
                    files.value[index].favorite = null
                }
                alertMessage.value = 'Successfully remove to favorites'
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })
            
        })

        watch(folder_id, async () => {
            isUpload.value = false;
            
            folders.value = [];
            files.value = [];
            await loadFolders();
            await loadFiles();
            await checkPath();
            emitter.emit('FOLDER_ID', folder_id.value)
        })

        watch(paramsFiles.value, async () => {
            tempFiles.value = files.value;
            await loadFiles();
            files.value.forEach(file => {
                tempFiles.value.push(file)
            })

            files.value = tempFiles.value
        })

        watch(paramsFolders.value, async () => {
            tempFolders.value = folders.value;
            await loadFolders();
            folders.value.forEach(file => {
                tempFolders.value.push(file)
            })

            folders.value = tempFolders.value
        })

        return {
            folder_id,
            isList,
            folders,
            loadingFolders,
            isUpload,
            files,
            path,
            loadingPath,
            loadingFiles,
            alertMessage,
            showSuccessAlert,
            handleClickClose
        }
    }
})
</script>
<style scoped>
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
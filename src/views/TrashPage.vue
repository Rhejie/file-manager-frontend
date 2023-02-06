<template>
    <div class="pt-4 max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <main class="flex-1 overflow-y-auto h-screen">
            <div
                class=" w-full flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-300">
                <div>

                    <h4 class="text-2xl font-bold leading-tight text-gray-700">Trash</h4>
                </div>
            </div>
            <!-- <nav class="flex bg-white p-2" aria-label="Breadcrumb">
                <ol role="list" class="flex items-center space-x-4">
                    <li>
                        <div>
                            <a href="#" class="text-gray-400 hover:text-gray-500">
                                <HomeIcon class="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                <span class="sr-only">Home</span>
                            </a>
                        </div>
                    </li>
                    <li v-for="page in pages" :key="page.name">
                        <div class="flex items-center">
                            <ChevronRightIcon class="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                            <a :href="page.href" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                                :aria-current="page.current ? 'page' : undefined">{{ page.name }}</a>


                        </div>
                    </li>
                </ol>
            </nav> -->
            <!-- <p v-for="folder in folders" :key="folder.id">{{folder.id}}</p> -->
            <Transition name="slide-fade">
                <SuccessAlert v-if="showSuccessAlert" class="mt-2" @handleClickClose="handleClickClose" :message="alertMessage" />
            </Transition>
            <TrashGridView v-if="!isList" :folders="folders" :loading="loading" :fileLenght="folders.length" />
            <TrashListView v-else :folders="folders" :loading="loading" :fileLenght="folders.length"/>
            <TrashFileGridView v-if="!isList" :files="files" :loading="loadingFiles"/>
            <TrashFileListView v-else :files="files" :loading="loadingFiles"/>
        </main>
    </div>
</template>
<script>
import { setActiveNavBar } from "@/composables/SetActiveNav";
// import AssignedGridView from "@/components/assigned/AssignedGridView.vue"
import TrashGridView from "@/components/files/TrashGridView.vue";
import { computed, defineComponent, onMounted, ref } from "vue";
import TrashListView from '@/components/files/TrashListView.vue'
import { useStore } from "vuex";
import { useEmitter } from '@/composables/useEmitter'
import { fetchWithPaginate } from '@/composables/resource_service';
import TrashFileGridView from "@/components/files/TrashFileGridView.vue";
import TrashFileListView from "@/components/files/TrashFileListView.vue";
import SuccessAlert from "@/components/ui/SuccessAlert.vue";
import { setTitle } from "@/composables/title_service";
// import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/solid'

export default defineComponent({
    name: "TrashPage",
    components: {
    // ChevronRightIcon,
    // HomeIcon,
    // useEmitter,
    TrashGridView,
    TrashListView,
    TrashFileGridView,
    TrashFileListView,
    SuccessAlert
},
    setup() {
        const folder_id = ref(null)
        const emitter = useEmitter
        const folders = ref([]);
        const files = ref([]);
        const loading = ref(false);
        const loadingFiles = ref(false)
        const store = useStore();
        const alertMessage = ref('')
        const showSuccessAlert = ref(false)

        const fetchFolders = async () => {
            // loading.value = true
            const params = {
                search: ''
            }
            const { load, data } = fetchWithPaginate(params, '/file-manager/folder/trash/list');
            await load();
            console.log(data.value)

            folders.value = data.value.folders
            loading.value = false
            folder_id.value = data.value.folder_id
            emitter.emit('FOLDER_ID', data.value.folder_id)
        }

        const fetchFiles = async () => {
            loadingFiles.value = true

            const params = {
                search: ''
            }
            const {data, load} = fetchWithPaginate(params, '/file-manager/file/trash/list')
            await load();
            files.value = data.value
            loadingFiles.value = false
        }

        const handleClickClose = () => {
            showSuccessAlert.value = false
        }

        onMounted( async () => {
            setActiveNavBar('Trash');

            setTitle('Trash');
            
            emitter.on('RESTORED_FOLDER', (folder) => {
                let _index = folders.value.findIndex(f => f.id == folder.id);
                folders.value.splice(_index, 1);
                alertMessage.value = 'Successfully restored';
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })

            emitter.on('RESTORED_FILE', (file) => {
                let _index = files.value.findIndex(f => f.id == file.id);
                files.value.splice(_index, 1);
                alertMessage.value = 'Successfully restored';
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })

            emitter.on('PERMANENT_DELETED_FOLDER', folder => {
                let _index = folders.value.findIndex(f => f.id == folder.id);
                folders.value.splice(_index, 1);
                alertMessage.value = 'Successfully deleted';
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })

            emitter.on('PERMANENT_DELETED_FILE', file => {
                let _index = files.value.findIndex(f => f.id == file.id);
                files.value.splice(_index, 1);
                alertMessage.value = 'Successfully deleted';
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })

            await fetchFolders(); 
            await fetchFiles();  

            
        })

        const pages = [
            { name: 'files', href: '#', current: false },
            { name: 'assigned with me', href: '#', current: true },
        ]

        return {
            folders,
            loading,
            pages,
            isList: computed(() => store.state.isList),
            files,
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
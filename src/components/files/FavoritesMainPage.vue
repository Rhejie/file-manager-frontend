<template>
    <Transition name="slide-fade">
        <SuccessAlert v-if="showSuccessAlert" class="mt-2" @handleClickClose="handleClickClose"
            :message="alertMessage" />
    </Transition>
    <div v-if="!loadingFolders && !loadingFiles">
        <FavoriteFolderGridView v-if="!isList" :loading="loadingFolders" :type="'folder'" :favorites="folders"
            :next="nextPageFolder" />
        <FavoriteListView v-else-if="isList" :loading="loadingFolders" :type="'folder'" :favorites="folders"
            :next="nextPageFolder" />
        <FavoriteFolderGridView v-if="!isList && files.length > 0" :loading="loadingFiles" :type="'file'"
            :favorites="files" :next="nextPageFile" />
        <FavoriteListView v-else-if="isList" :loading="loadingFiles" :type="'file'" :favorites="files"
            :next="nextPageFile" />
    </div>
    <div v-else>
        <GridSkeleton />
    </div>
</template>
<script>
import { computed, defineComponent, onMounted, provide, ref, watch } from "vue";
import { useStore } from "vuex";
import { fetchWithPaginate } from "@/composables/resource_service";
import FavoriteFolderGridView from "@/components/favorites/FavoriteFolderGridView.vue";
import { useEmitter } from "@/composables/useEmitter";
import SuccessAlert from "@/components/ui/SuccessAlert.vue";
import FavoriteListView from "@/components/favorites/FavoriteListView.vue";
import GridSkeleton from "@/components/layout/GridSkeleton.vue";
// import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/solid'

export default defineComponent({
    name: "FavoriteMainPage",
    components: {
        FavoriteFolderGridView,
        SuccessAlert,
        FavoriteListView,
        GridSkeleton
    },
    setup() {

        const store = useStore();
        const emitter = useEmitter;
        const paramsFolder = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })

        const paramsFile = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })

        const folders = ref([])
        const files = ref([])
        const loadingFolders = ref(false)
        const loadingFiles = ref(false)
        const nextPageFolder = ref(null)
        const nextPageFile = ref(null)
        const alertMessage = ref(null)
        const showSuccessAlert = ref(false)
        const tempFolders = ref([])
        const tempFiles = ref([])

        const getAllFavoriteFolders = async () => {
            loadingFolders.value = true
            const { data, load, nextPage } = fetchWithPaginate(paramsFolder.value, '/user/favorites/folders')
            await load();
            folders.value = data.value.data
            loadingFolders.value = false
            nextPageFolder.value = nextPage.value
        }

        const getAllFavoriteFiles = async () => {
            loadingFiles.value = true
            const { data, load, nextPage } = fetchWithPaginate(paramsFile.value, '/user/favorites/files')
            await load();
            files.value = data.value.data
            loadingFiles.value = false
            nextPageFile.value = nextPage.value
        }

        const handleClickloadMore = () => {
            paramsFolder.value.page = paramsFolder.value.page + 1
        }

        const handleClickloadMoreFiles = () => {
            paramsFile.value.page = paramsFile.value.page + 1
        }

        provide('loadMore', {
            clickNextPage: handleClickloadMore,
            clickNextPageFile: handleClickloadMoreFiles
        })

        watch(paramsFolder.value, async () => {
            tempFolders.value = folders.value
            await getAllFavoriteFolders()
            folders.value.forEach(file => {
                tempFolders.value.push(file)
            })

            folders.value = tempFolders.value

        })

        watch(paramsFile.value, async () => {
            tempFiles.value = files.value
            await getAllFavoriteFiles()
            files.value.forEach(file => {
                tempFiles.value.push(file)
            })

            files.value = tempFiles.value

        })

        onMounted(async () => {
            await getAllFavoriteFolders();
            await getAllFavoriteFiles();

            emitter.on('REMOVE_FAVORITE', ({ type, data }) => {
                if (type == 'folder') {
                    let index = folders.value.findIndex(folder => folder.id == data.id);
                    folders.value.splice(index, 1);
                }
                else {
                    let index = files.value.findIndex(folder => folder.id == data.id);
                    files.value.splice(index, 1);
                }
                alertMessage.value = 'Successfully remove to favorites'
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })
        })

        const pages = [
            { name: 'files', href: '#', current: false },
            { name: 'assigned with me', href: '#', current: true },
        ]

        return {
            pages,
            isList: computed(() => store.state.isList),
            folders,
            files,
            nextPageFolder,
            nextPageFile,
            loadingFolders,
            loadingFiles,
            alertMessage,
            showSuccessAlert
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
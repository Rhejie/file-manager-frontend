<template>
    <div class="pt-4 max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <main class="flex-1 overflow-y-auto h-screen">
            <div
                class=" container w-full flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-300">
                <div>

                    <h4 class="text-2xl font-bold leading-tight text-gray-700">Assigned to me</h4>
                </div>
            </div>

            <GridSkeleton v-if="loadingFolders || loadingFiles" />
            <AssignedGridView v-if="!isList && assignedFolders.length > 0 && !loadingFiles" :assignedFiles="assignedFolders"/>
            <AssignedListView v-else-if="isList && assignedFolders.length > 0 && !loadingFiles" :loadingFolders = "loadingFolders" :assignedFiles="assignedFolders"/>
            <AssignedGridView v-if="!isList && assignedFiles.length > 0" :assignedFiles="assignedFiles" :type="'file'"/>
            <AssignedListView v-else-if="isList && assignedFiles.length > 0" :loadingFiles = "loadingFiles" :assignedFiles="assignedFiles" :type="'file'"/>
            <EmptyFolder v-if="assignedFolders.length === 0 && assignedFiles.length === 0 && !loadingFolder && !loadingFiles" />

        </main>
    </div>
</template>
<script>
import { setActiveNavBar } from "@/composables/SetActiveNav";
import AssignedGridView from "@/components/assigned/AssignedGridView.vue"
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { fetchWithPaginate } from "@/composables/resource_service";
import { useEmitter } from "@/composables/useEmitter";
import EmptyFolder from "@/components/layout/EmptyFolder.vue";
import AssignedListView from "@/components/assigned/AssignedListView.vue";
import GridSkeleton from "@/components/layout/GridSkeleton.vue";
import { setTitle } from "@/composables/title_service";
// import AssignedGridFileView from "../components/assigned/AssignedGridFileView.vue";
// import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/solid'

export default defineComponent({
    name: "AssignedPage",
    components: {
    // ChevronRightIcon,
    // HomeIcon,
    AssignedGridView,
    EmptyFolder,
    AssignedListView,
    GridSkeleton
},
    setup() {

        const store = useStore();
        const emitter = useEmitter;
        const assignedFolders = ref([]);
        const assignedFiles = ref([]);
        const loadingFiles = ref(false);
        const loadingFolders = ref(false);

        const loadAssingedFolders = async () => {
            loadingFolders.value = true;
            const params = {
                search : ''
            }
            const {load, data} = fetchWithPaginate(params, `/user/assigned/folders`);
            await load();
            assignedFolders.value = data.value;
            loadingFolders.value = false;
        }

        const loadAssingedFiles = async () => {
            loadingFiles.value = true;
            const params = {
                search: ''
            }
            const {load, data} = fetchWithPaginate(params, `/user/assigned/files`);
            await load();
            assignedFiles.value = data.value;
            loadingFiles.value = false
        }

        onMounted( async () => {

            setActiveNavBar('Assign to me');

            setTitle('Assigned to me');
            await loadAssingedFolders();
            await loadAssingedFiles();

            emitter.emit('FOLDER_ID', null)
        })

        return {
            isList: computed(() => store.state.isList),
            assignedFolders,
            loadingFiles,
            assignedFiles,
            loadingFolders

        }
    }
})
</script>
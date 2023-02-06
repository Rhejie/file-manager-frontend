<template>
    <HeadingSettings />
    <div class="flex-1 flex items-stretch overflow-hidden">
        <router-view></router-view>
        <SidePreviewFIleVue v-if="showSideBar" :selected-data="selectedData" :file-type="fileType" :assignedStatus="assignedStatus"/>
    </div>
    <PopupResponse />
    <PopupUpload />
    <AssignedModal :isAssigned="isAssigned"/>
    <ShareFileToLmsModal/>
    <MoveModal/>
    <DeleteConfirmationModal />
</template>
<script>
import { computed, defineComponent, onMounted, provide, ref, watch } from "vue";
import SidePreviewFIleVue from "@/components/files/SidePreviewFIle.vue";
import HeadingSettings from "@/components/files/HeadingSettings.vue";
import PopupResponse from "@/components/modal/PopupResponse.vue"
import { useEmitter } from "@/composables/useEmitter";
import PopupUpload from "@/components/files/PopupUpload.vue"
import AssignedModal from "@/components/modal/AssignedModal.vue"
import { useRoute } from "vue-router";
import MoveModal from "@/components/modal/MoveModal.vue"
import { useStore } from "vuex";
import { fetch, query } from "@/composables/resource_service";
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal.vue";
import ShareFileToLmsModal from "@/components/modal/ShareFileToLmsModal.vue";

export default defineComponent({
    name: "ViewFiles",
    components: {
    SidePreviewFIleVue,
    HeadingSettings,
    PopupResponse,
    PopupUpload,
    AssignedModal,
    MoveModal,
    DeleteConfirmationModal,
    ShareFileToLmsModal
},
    props: {
        selected: {
            type: Object
        }
    },
    setup() {
        const showSideBar = ref(false);
        const store = useStore();
        const emitter = useEmitter;
        const selectedData = ref({});
        const fileType = ref("")
        const assignedStatus = ref(true)
        const route = useRoute();
        const routeName = computed(() => route.name)
        const refreshKey = ref(0)
        const isAssigned = ref(false)

        const getUserProfile = async() => {
            const { data, load } = query('/user');
            await load();
            store.commit('setUserProfile', data.value)
        }

        provide('model-actions', {
            clickAssignedModalAction: () => {
                isAssigned.value = true
            }
        })

        onMounted(async () => {
            emitter.on("SELECTED_DATA", ({ data, type, assigned_status }) => {
                console.log(JSON.stringify(data), 'sideview')
                if (data && data.id) {
                    showSideBar.value = true;
                    selectedData.value = data;
                    fileType.value = type;
                    assignedStatus.value = assigned_status;
                }
            });

            emitter.on('CLOSE_SIDE_PREVIEW', () => {
                showSideBar.value = false
            })

            await getUserProfile();
        })

        watch(routeName, () => {
            showSideBar.value = false;
        })

        return {
            showSideBar,
            selectedData,
            fileType,
            assignedStatus,
            refreshKey
        }
    }
})
</script>
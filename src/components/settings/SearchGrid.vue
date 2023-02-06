<template>
    <section v-if="!loadingData" :class="['mt-8', fileNumber === 0 ? 'pb-16' : '']"
        aria-labelledby="gallery-heading">
        <h2 class="mt-0">Folders</h2>
        <ul role="list"
            :class="['mt-3 grid grid-cols-1 gap-5 sm:gap-6 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 ', isClickPreview ? 'lg:grid-cols-3' : 'lg:grid-cols-4']">
            <li v-for="(folder, index) in f" @click="handleClickFolder(folder)" @dblclick="handleOpenFolderClick(folder)"
                :key="index" class="ease-out duration-300 col-span-1 cursor-pointer flex shadow-sm rounded-md">
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
                        <DropdownOption :data="folder" :type="'folder'" :fromAssignedPage="isFromAssignedPage"
                            :permission="getPermission" />
                    </div>
                </div>
            </li>
        </ul>
    </section>
</template>
<script>
import { computed, defineComponent } from "vue";
import DropdownOption from "../files/DropdownOption.vue";

export default defineComponent({
    name: "SearchGrid",
    components: { 
        DropdownOption 
    },
    props: {
        folders: [],
        loading: {
            type: Boolean,
            default: false
        },
        fromAssignedPage: {
            type: Boolean,
            default: false,
        },
        permission: {
            type: String,
            default: 'read_write'
        }
    },
    setup(props) {

        return {
            loadingData : computed(() => props.loading),
            f : computed(() => props.folders),
            isFromAssignedPage: computed(() => props.fromAssignedPage),
            getPermission : computed(() => props.permission)
        }
    }

})
</script>
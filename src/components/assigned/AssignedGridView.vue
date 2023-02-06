<template>
    <section :class="[fileType == 'file' ? 'pb-16' : 'mb-2']" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" class="sr-only">Recently viewed</h2>
        <h2 class="mt-0">{{ fileType == 'file' ? 'Files' : 'Folders'}}</h2>
        <ul v-if="fileType != 'file'" role="list" :class="['mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4']">
            <li v-for="(file, index) in files" :key="index" @dblclick="handleOpenFolderClick(file.assignable)" @click="handleClickFolder(file.assignable)" class="ease-out duration-300 col-span-1 flex shadow-sm rounded-md">
                <div
                    :class="['border-t border-l border-b border-gray-200 bg-gray-200 flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md ']">
                    <FolderIcon class="w-10 mx-auto text-gray-500" />
                </div>
                <div
                    class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                    <div class="flex-1 px-4 py-2 text-sm truncate">
                        <a href="#" class="text-gray-900 font-medium hover:text-gray-600">{{file.assignable.name}}</a>
                    </div>
                    <div class="flex-shrink-0 pr-2">

                        <DropdownOption :data="file.assignable" :type="'folder'" :permission="file.user_status" :fromAssignedPage="true"/>
                    </div>
                </div>
            </li>
        </ul>
        <div
            v-else
            :class="['grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-4 lg:gap-x-2', isClickPreview ? 'lg:grid-cols-4' : 'lg:grid-cols-6']">
            <div v-for="file in files" :key="file.id"  @click="handleClickFilePreview(file.assignable)"
                class="group relative flex flex-col overflow-hidden shadow-md rounded-lg border border-gray-200 bg-white">
                <div class="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-40">

                    <img v-if="isPicture(file.assignable.mimetype)" :src="file.assignable.url ? file.assignable.url : file.assignable.url_path" :alt="file.assignable.name"
                        class="h-full w-full object-cover object-center sm:h-full sm:w-full" />
                    <component v-else :is="fileIcon(file.assignable.mimetype)"
                        class="mx-auto h-full w-full flex-shrink-0 text-indigo-300" aria-hidden="true" />
                </div>
                <div class="flex flex-1 flex-col space-y-2 p-4">
                    <h3 class="text-sm font-medium text-gray-900">
                        <a :href="file.href">
                            <span aria-hidden="true" class="absolute inset-0" />
                            {{ file.assignable.name }}
                        </a>
                    </h3>
                    <div class="flex flex-1 flex-col justify-end">
                        <p class="text-sm italic text-gray-500">Owner: {{ file.assignable.user.name }}</p>
                        <p class="text-base font-medium text-gray-900">File Size: {{ convertFileSizeToMB(file.assignable.filesize) }}</p>
                    </div>
                </div>
                <div class="h-full w-full">
                    <DropdownOption class="mx-auto float-right mr-2 mb-2" :data="file.assignable" :type="'file'" :permission="file.user_status" :fromAssignedPage="true"/>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import {
    FolderIcon,
    // DotsVerticalIcon,
DocumentTextIcon,
} from '@heroicons/vue/solid'
import { useEmitter } from "@/composables/useEmitter";
import DropdownOption from "../files/DropdownOption.vue";
import { useRouter } from "vue-router";

export default defineComponent({
    name: "AssignedGridView",
    props: {
        assignedFiles: [],
        type: null
    },
    components: {
    FolderIcon,
    // DotsVerticalIcon,
    DropdownOption
},
    setup(props) {

        const emitter =useEmitter;
        const router = useRouter();
        const files = computed(() => {
            return props.assignedFiles
        });

        const fileType = computed(() => props.type)

        const isClickPreview = ref(false);


        const isPicture = (mimetype) => {
            if (mimetype == 'png') {
                return true
            }
            else if (mimetype == 'gif') {
                return true
            }
            else if (mimetype == 'jpg') {
                return true;
            }
            else if (mimetype == 'jpeg') {
                return true;
            }
            else {
                false
            }
        }
        const fileIcon = () => {
            return DocumentTextIcon;
        }

        const handleOpenFolderClick = (folder) => {
            router.push({ name: "Assigned Folder", params: { id: folder.id } })
        }

        const handleClickFolder = (folder) => {
            emitter.emit('SELECTED_DATA', {
                data: folder,
                type: 'folder',
                assigned_status: false
            })
            emitter.emit('CLICK_PREVIEW', true)
        }

        const handleClickFilePreview = (file) => {
            emitter.emit('SELECTED_DATA', {
                data: file,
                type: 'file',
                assigned_status: false
            })
            isClickPreview.value = true;

        }

        const convertFileSizeToMB = (size) => {
            return (size / (1024 ** 2)).toFixed(2) + 'mb'
        }

        onMounted(() => {
            console.log(props.assignedFiles, 'asd')
            if(fileType.value == 'file') {
                emitter.on('CLICK_PREVIEW', () => {
                    isClickPreview.value = true
                })
            }
        })
        
        return {
            files,
            fileType,
            isClickPreview,
            isPicture,
            fileIcon,
            handleClickFolder,
            handleClickFilePreview,
            handleOpenFolderClick,
            convertFileSizeToMB
        }
    }
})
</script>
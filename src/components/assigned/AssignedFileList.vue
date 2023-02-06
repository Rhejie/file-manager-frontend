<template>
    <div>
        <section :class="['mt-6 ', fileNumber ? 'mb-2' : 'pb-20' ]" aria-labelledby="gallery-heading">
        <div class="sm:px-6 px-4">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-xl text-gray-500">Files</h1>
                </div>
            </div>
            <div class=" flex flex-col">
            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle md:px-6">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class=" text-left text-sm font-semibold text-gray-900"></th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                            <th scope="col" class="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 ">Owner</th>
                            <th scope="col" class="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 ">Email</th>
                            <th scope="col" class="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 ">File Size</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Modified</th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span class="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white"
                        v-infinite-scroll="loadMore.clickNextPageFile" 
                        :infinite-scroll-immediate-check="false"
                        :infinite-scroll-disabled="disableScroll" 
                        infinite-scroll-watch-disabled="disableScroll">
                        <tr class="hover:bg-gray-300" v-loading="loadingData" v-for="(file, index) in f" @click="handleClickFilePreview(file)" @dblclick="handleOpenFolder(file)"  :key="file.id" :class="index % 2 === 0 ? undefined : 'bg-gray-50'">
                            <td class="whitespace-nowrap text-sm font-medium text-gray-500 ">
                                <img v-if="isPicture(file.mimetype)" :src="file.url ? file.url : file.url_path" :alt="file.name"
                                class="w-5 object-cover object-center sm:h-full sm:w-full" />
                                <component v-else :is="fileIcon(file.mimetype)"
                                class="mx-auto w-5 flex-shrink-0 text-indigo-300" aria-hidden="true" />
                            </td>
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">{{ file.name }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ file.user.name }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ file.user.email }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ convertFileSizeToMB(file.filesize) }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ file.created_at }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ file.updated_at }}</td>
                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <DropdownOption class="mx-auto float-right mr-2 mb-2" :data="file" :type="'file'" :permission="file.user_status" :fromAssignedPage="true"/>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
        </div>
    </section>
    </div>
</template>
<script>
import { computed, defineComponent, inject, ref } from "vue";
import {
    DocumentTextIcon,
} from '@heroicons/vue/solid'
import { useEmitter } from "@/composables/useEmitter";
import { useRouter } from "vue-router";
// import GridSkeleton from "@/components/layout/GridSkeleton.vue"
import DropdownOption from "@/components/files/DropdownOption.vue";
// import EmptyFolder from "@/components/layout/EmptyFolder.vue"

export default defineComponent({
    name: "AssignedFileList",
    components: {
    // DropdownOptionVue,
    DropdownOption
},
    props: {
        files: {
            type: Array,
        },
        loading: {
            type: Boolean,
            default: false,
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
        const emitter = useEmitter;
        const loadMore = inject('loadMore');
        const router = useRouter();
        const isClickPreview = ref(false)
        const isFromAssignedPage = computed(() => props.fromAssignedPage)
        const getPermission = computed(() => props.permission)

        const fileIcon = () => {
            return DocumentTextIcon;
        }

        const handleClickFolder = (folder) => {
            emitter.emit('SELECTED_DATA', {
                data: folder,
                type: 'folder',
                assigned_status: !props.fromAssignedPage,
            })
        }

        const handleClickFilePreview = (file) => {
            emitter.emit('SELECTED_DATA', {
                data: file,
                type: 'file'
            })
            isClickPreview.value = true;
        }

        const handleOpenFolderClick = (folder) => {
            router.push({ name: "Assigned Folder", params: { id: folder.id } })
        }

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


        const convertFileSizeToMB = (size) => {
            return (size / (1024 ** 2)).toFixed(2) + 'mb'
        }

        return {
            f: computed(() => props.files),
            handleClickFolder,
            handleOpenFolderClick,
            loadingData: computed(() => props.loading),
            isPicture,
            fileIcon,
            handleClickFilePreview,
            isClickPreview,
            isFromAssignedPage,
            getPermission,
            convertFileSizeToMB,
            loadMore
        }
    }
})
</script>
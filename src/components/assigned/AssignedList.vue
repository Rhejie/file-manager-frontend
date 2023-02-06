<template>
    <section :class="['mt-6 ', fileNumber ? 'mb-2' : 'pb-20' ]" aria-labelledby="gallery-heading">
        <div class="sm:px-6 px-4">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-xl text-gray-500">Folders</h1>
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
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Owner</th>
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Email</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Modified</th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span class="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white"
                        v-infinite-scroll="loadMore.clickNextPage" 
                        :infinite-scroll-immediate-check="false"
                        :infinite-scroll-disabled="disableScroll" 
                        infinite-scroll-watch-disabled="disableScroll">
                        <tr class="hover:bg-gray-300" 
                            v-loading="loadingData" 
                            v-for="(file, index) in tableData" 
                            @click="handleClickCell(file)" 
                            @dblclick="handleOpenFolder(file)"  
                            :key="file.id" :class="index % 2 === 0 ? undefined : 'bg-gray-50'">
                            <td class="whitespace-nowrap text-sm font-medium text-gray-500 ">
                                <FolderIcon class="w-5 mx-auto" />
                            </td>
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">{{ file.name }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ file.user.name }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ file.user.email }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ file.created_at }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ file.updated_at }}</td>
                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <DropdownOptionVue :data="file" :type="'folder'" :fromAssignedPage="isFromAssignedPage" :permission="getPermission"/>
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
</template>
<script>
import { computed, defineComponent, inject } from "vue";
import {
    FolderIcon,
} from '@heroicons/vue/solid'
import { useEmitter } from "@/composables/useEmitter";

import DropdownOptionVue from "@/components/files/DropdownOption.vue";
import { useRouter } from "vue-router";

export default defineComponent({
    // Folder list
    name: "AssignedList",
    components: {
        FolderIcon,
        DropdownOptionVue
    },
    props: {
        folders: {
            type: Array,
        },
        loading: {
            type: Boolean,
            default: false
        },
        fileLenght: null,
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
        const router = useRouter();
        const loadMore = inject('loadMore');
        const fileNumber = computed(() => props.fileLenght)
        const isFromAssignedPage = computed(() => props.fromAssignedPage)
        const getPermission = computed(() => props.permission)

        const tableData = computed(() => props.folders)

        const handleClickFolder = (folder) => {
            emitter.emit('SELECTED_DATA', {
                data: folder,
                type: 'folder'
            })
        }

        const handleClickCell = (data) => {
            emitter.emit('SELECTED_DATA', {
                data,
                type: 'folder',
                assigned_status: !props.fromAssignedPage,
            })
        }

        const handleOpenFolder = (data) => {
            router.push({ name: "Assigned Folder", params: { id: data.id } })
        }

        return {
            tableData,
            handleClickFolder,
            loadingData: computed(() => props.loading),
            handleClickCell,
            handleOpenFolder,
            fileNumber,
            isFromAssignedPage,
            getPermission,
            loadMore
        }
    }
})
</script>
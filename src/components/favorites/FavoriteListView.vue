<template>
    <section :class="[fileType == 'file' ? 'pb-16' : 'mb-2']" aria-labelledby="gallery-heading">
        <!-- <h2 id="gallery-heading" class="sr-only">Recently viewed</h2>
        <h2 class="mt-0">{{ fileType == 'file' ? 'Files' : 'Folders'}}</h2> -->
        <div class="sm:px-6" v-if="fileType != 'file'">
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
                                        <th scope="col"
                                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                                        <th scope="col"
                                            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Owner</th>
                                        <th scope="col"
                                            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Email</th>
                                        <th scope="col"
                                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created
                                        </th>
                                        <th scope="col"
                                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last
                                            Modified</th>
                                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span class="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white">
                                    <tr class="hover:bg-gray-300" v-loading="isLoadingFolders"
                                        v-for="(file, index) in files" @click="handleClickFolder(file)"
                                        @dblclick="handleOpenFolderClick(file)" :key="file.id"
                                        :class="index % 2 === 0 ? undefined : 'bg-gray-50'">
                                        <td class="whitespace-nowrap text-sm font-medium text-gray-500 ">
                                            <FolderIcon class="w-5 ml-5 mx-auto" />
                                        </td>
                                        <td
                                            class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">
                                            {{ file.favorable.name }}
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {{ file.favorable.user ? file.favorable.user.name : '' }}
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {{ file.favorable.user ? file.favorable.user.email : '' }}
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {{ file.favorable.created_at }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {{ file.favorable.updated_at }}
                                        </td>
                                        <td
                                            class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <DropdownOption :data="file.favorable" :type="'folder'" :fromAssignedPage="false" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="sm:px-6 px-4" v-else>
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
                                        <th scope="col"
                                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                                        <th scope="col"
                                            class="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 ">Owner
                                        </th>
                                        <th scope="col"
                                            class="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 ">Email
                                        </th>
                                        <th scope="col"
                                            class="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 ">File Size
                                        </th>
                                        <th scope="col"
                                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created
                                        </th>
                                        <th scope="col"
                                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last
                                            Modified</th>
                                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span class="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white">
                                    <tr class="hover:bg-gray-300" v-loading="isLoadingFiles"
                                        v-for="(file, index) in files" @click="handleClickFolder(file)"
                                        @dblclick="handleOpenFolderClick(file)" :key="file.id"
                                        :class="index % 2 === 0 ? undefined : 'bg-gray-50'">
                                        <td class="whitespace-nowrap text-sm font-medium text-gray-500 ">
                                            <img v-if="isPicture(file.favorable.mimetype)"
                                                :src="file.favorable.url ? file.favorable.url : file.favorable.url_path"
                                                :alt="file.favorable.name"
                                                class="mx-auto w-5 flex-shrink-0 text-indigo-300" />
                                            <component v-else :is="fileIcon(file.favorable.mimetype)"
                                                class="mx-auto w-5 flex-shrink-0 text-indigo-300" aria-hidden="true" />
                                        </td>
                                        <td
                                            class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">
                                            {{ file.favorable.name }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{
                                        file.favorable.user ? file.favorable.user.name : '' }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{
                                        file.favorable.user ? file.favorable.user.email : '' }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{
                                        convertFileSizeToMB(file.favorable.filesize) }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ file.favorable.created_at
                                        }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ file.favorable.updated_at
                                        }}</td>
                                        <td
                                            class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <DropdownOption :data="file.favorable" :type="'file'" :fromAssignedPage="false" />
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
    name: "FavoriteListView",
    props: {
        favorites: [],
        type: null,
        loadingFolders: {
            type: Boolean,
            default: false,
        },
        loadingFiles: {
            type: Boolean,
            default: false,
        }
    },
    components: {
        FolderIcon,
        // DotsVerticalIcon,
        DropdownOption
    },
    setup(props) {

        const emitter = useEmitter;
        const router = useRouter();
        const isLoadingFolders = computed(() => props.loadingFolders)
        const isLoadingFiles = computed(() => props.loadingFiles)
        const files = computed(() => {
            return props.favorites
        });

        const fileType = computed(() => props.type)
        const data = ref({})

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
            router.push({ name: "Assigned Folder", params: { id: folder.favorable.id } })
        }

        const handleClickFolder = (folder) => {

            data.value = folder.favorable

            emitter.emit('SELECTED_DATA', {
                data: data.value,
                type: fileType.value != 'file' ? 'folder' : 'file',
                assigned_status: false
            })
            isClickPreview.value = true;

        }

        const handleClickFilePreview = (file) => {
            const data = file.favorable
            console.log(file.favorable)
            emitter.emit('SELECTED_DATA', {
                data,
                type: 'file',
                assigned_status: false
            })
            isClickPreview.value = true;
        }

        const convertFileSizeToMB = (size) => {
            return (size / (1024 ** 2)).toFixed(2) + 'mb'
        }

        onMounted(() => {
            console.log(props.favorites, 'asd')
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
            isLoadingFolders,
            isLoadingFiles,
            convertFileSizeToMB
        }
    }
})
</script>
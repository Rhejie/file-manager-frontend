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
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Day/s Left</th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span class="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr class="hover:bg-gray-300" v-loading="loadingData" v-for="(person, personIdx) in tableData" @click="handleClickCell(person)" @dblclick="handleOpenFolder(person)"  :key="person.id" :class="personIdx % 2 === 0 ? undefined : 'bg-gray-50'">
                            <td class="whitespace-nowrap text-sm font-medium text-gray-500 ">
                                <FolderIcon class="w-5 mx-auto" />
                            </td>
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">{{ person.name }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ person.user.name }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ person.user.email }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ person.created_at }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ person.updated_at }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ computeDays(person.deleted_at) }}</td>
                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <TrashDropdownOptionVue :data="person" :type="'folder'" />
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
import { computed, defineComponent } from "vue";
import {
    FolderIcon,
} from '@heroicons/vue/solid'
import { useEmitter } from "@/composables/useEmitter";

import TrashDropdownOptionVue from "./TrashDropdownOption.vue";
import { useRouter } from "vue-router";

export default defineComponent({
    name: "TrashListView",
    components: {
        FolderIcon,
        TrashDropdownOptionVue
    },
    props: {
        folders: {
            type: Array,
        },
        loading: {
            type: Boolean,
            default: false
        },
        fileLenght: null
    },
    setup(props) {
        const emitter = useEmitter;
        const router = useRouter();
        const fileNumber = computed(() => props.fileLenght)

        const tableData = computed(() => props.folders)

        const handleClickFolder = (folder) => {
            emitter.emit('SELECTED_DATA', {
                data: folder,
                type: 'folder'
            })
        }
        const computeDays = (response) => {
            // var currentDate = new Date(response);
            // var current = new Date()
            // var eto = current.getTime() 
            // var a = new Date(response)
            // var date = a.getTime();
            var resDate = new Date(response)
            // console.log(date)
            // console.log(eto)
            var currentDate = new Date();
            var difference = (currentDate.getTime() - resDate.getTime())
            var remainingDays = 30 - Math.ceil(difference / (1000 * 3600 * 24)) 
            // console.log(test1)
            return remainingDays
        }

        const handleClickCell = (data) => {
            emitter.emit('SELECTED_DATA', {
                data,
                type: 'folder',
                assigned_status: false,
            })
        }

        const handleOpenFolder = (data) => {
            router.push({ name: "Open Folder", params: { id: data.id } })
        }

        return {
            computeDays,
            tableData,
            handleClickFolder,
            loadingData: computed(() => props.loading),
            handleClickCell,
            handleOpenFolder,
            fileNumber
        }
    }
})
</script>
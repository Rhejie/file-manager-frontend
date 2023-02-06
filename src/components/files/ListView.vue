<template>
    <section :class="['mt-6 ', fileNumber ? 'mb-2' : 'pb-20' ]" aria-labelledby="gallery-heading">
        <div class="sm:px-6 px-4">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h2>Folders</h2>
                </div>
            </div>
            <div class=" flex flex-col">
            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle md:px-6">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300" v-infinite-scroll="loadMore.clickNextPage" 
                    :infinite-scroll-immediate-check="false"
                    :infinite-scroll-disabled="disableScroll" 
                    infinite-scroll-watch-disabled="disableScroll">
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
                    <tbody class="bg-white">
                        <tr class="hover:bg-gray-300" v-loading="loadingData" v-for="(person, personIdx) in tableData" @click="handleClickCell(person)" @dblclick="handleOpenFolder(person)"  :key="person.id" :class="personIdx % 2 === 0 ? undefined : 'bg-gray-50'">
                            <td class="whitespace-nowrap text-sm font-medium text-gray-500 ">
                                <FolderIcon class="w-5 mx-auto" />
                            </td>
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">{{ person.name }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ person.user ? person.user.name : '' }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ person.user ? person.user.email : '' }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ person.created_at }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ person.updated_at }}</td>
                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <DropdownOptionVue :data="person" :type="'folder'" :isFromMainPage="isFromMainPage"/>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                    <!-- <div class="mt-2 mb-2 ml-4" v-if="nextLink">
                        <ButtonUi class="w-40" @handleClick="loadMore.clickNextPage" />
                    </div> -->
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

import DropdownOptionVue from "./DropdownOption.vue";
import { useRouter } from "vue-router";
import { uniqBy } from "lodash-es"
// import ButtonUi from "../ui/ButtonUi.vue";

export default defineComponent({
    name: "ListView",
    components: {
    FolderIcon,
    DropdownOptionVue,
    // ButtonUi
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
        isFromMainPage: {
            type: Boolean,
            default: false,
        },
        next: {
            type: Boolean,
            default: null
        }
    },
    setup(props) {
        const emitter = useEmitter;
        const loadMore = inject('loadMore')
        const router = useRouter();
        const fileNumber = computed(() => props.fileLenght)

        const tableData = computed(() => {
            return uniqBy(props.folders,function(e){
                return e?.id
            })
        })

        const nextLink = computed(() => props.next)

        const handleClickFolder = (folder) => {
            emitter.emit('SELECTED_DATA', {
                data: folder,
                type: 'folder'
            })
        }

        const handleClickCell = (data) => {
            emitter.emit('SELECTED_DATA', {
                data,
                type: 'folder'
            })
        }

        const handleOpenFolder = (data) => {
            router.push({ name: "Open Folder", params: { id: data.id } })
        }

        return {
            tableData,
            handleClickFolder,
            loadingData: computed(() => props.loading),
            handleClickCell,
            handleOpenFolder,
            fileNumber,
            nextLink,
            loadMore
        }
    }
})
</script>
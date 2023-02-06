<template>
    <Combobox as="div" :class="['hidden sm:block']" v-model="searchAll">
        <!-- <ComboboxLabel class="block text-sm font-medium text-gray-700"></ComboboxLabel> -->
        <div class="relative mt-1">
            <ComboboxInput
                class=" h-full w-full border-transparent ml-10 mt-4 py-2 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:block"
                placeholder="Search All Files..."
                @change="query = $event.target.value" :display-value="(file) => file?.name" />
            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronDoubleUpIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </ComboboxButton>
    
            <ComboboxOptions v-if="files.length > 0"
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ComboboxOption v-for="file in files" :key="file.id" :value="file" as="template"
                    v-slot="{ active, selected }" @click="handleSelectedUser(file)">
                    <li
                        :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-gray-100' : 'text-gray-900']">
                        <!-- <span :class="['block truncate', selected && 'font-semibold']">
                            {{file.type}} : {{ file.type === 'Assigned' ? file.assignable.name : file.name }}
                        </span> -->
                        <div class="flex">
                            <span :class="['truncate', selected && 'font-semibold']">
                                {{file.type}} :
                            </span>
                            <span :class="['ml-2 truncate text-gray-500', active ? 'text-gray-400' : 'text-gray-500']">
                                {{ file.type === 'Assigned' ? file.assignable.name : file.name }}
                            </span>
                            <span :class="['ml-2 truncate text-gray-500', active ? 'text-gray-400' : 'text-gray-500']">
                                {{ getUserEmail(file) }}
                            </span>
                        </div>
    
                        <span v-if="selected"
                            :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-600']">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                    </li>
                </ComboboxOption>
            </ComboboxOptions>
        </div>
    </Combobox>
</template>
<script>
import { defineComponent, watch } from "vue";
import { ref } from 'vue'
import { CheckIcon, ChevronDoubleUpIcon } from '@heroicons/vue/solid'
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    // ComboboxLabel,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/vue'
import { fetch } from "@/composables/resource_service";
import { useRouter } from "vue-router";

export default defineComponent({
    name: 'SearchAll',
    components: {
        CheckIcon,
        ChevronDoubleUpIcon,
        Combobox,
        ComboboxButton,
        ComboboxInput,
        // ComboboxLabel,
        ComboboxOption,
        ComboboxOptions,
    },  
    setup() {
        

        const query = ref('')
        const searchAll = ref('')
        const router = useRouter();
        

        const loading = ref(false);
        const files = ref([])

        const search = async (query) => {
            loading.value = true;
            const { load, data } = fetch('/user/setting/search-all', query)
            await load();
            files.value = data.value.data
            loading.value = false
        }

        const handleSelectedUser = (file) => {
            if(file.type === 'Assigned') {
                const folder_id = file.file_type == 'folder' ? file.id : null
                router.push({ name: 'Search All', 
                    query: { 
                        name : file.assignable.name, 
                        id: file.assignable.id, 
                        type: file.type, 
                        file_type: file.file_type,
                        folder_id,
                    }})
                searchAll.value = ''
                return;
            }
            else if (file.type === 'File') {
                const folder_id = file.folder_id;
                router.push({
                    name: 'Search All',
                    query: {
                        name: file.name,
                        id: file.id,
                        type: file.type,
                        file_type: 'file',
                        folder_id,
                    }
                })
                searchAll.value = ''
                return;
            }
            else {
                const folder_id = file.folder_id;
                router.push({
                    name: 'Search All',
                    query: {
                        name: file.name,
                        id: file.id,
                        type: file.type,
                        file_type: 'folder',
                        folder_id,
                    }
                })
                searchAll.value = ''
                return 
            }
        }

        const getUserEmail = (file) => {
            if(file.type === 'Assigned') {
                return file.assignable.user ? ' - ' +file.assignable.user.email : ''
            }
            return file.user ? ' - ' +file.user.email : '';
        }

        watch(query, (val) => {
            if (val != '') {
                search(val);
            }
            else {
                files.value = []
            }
        })

        return {
            searchAll,
            query,
            files,
            handleSelectedUser,
            getUserEmail
        }
    }
})
</script>

<script setup>
import { ref, defineProps, computed, onMounted, watch, inject } from 'vue';
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/solid'
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxLabel,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/vue'
import { query } from '@/composables/resource_service';
import { accessToken } from '@/composables/local_storage';
import { useEmitter } from '@/composables/useEmitter';
import { useStore } from 'vuex';
import { searchUnits } from '@/composables/lms/lms_request';

const props = defineProps({
    name: {
        type: String,
        default: ''
    }
});
const emitter = useEmitter;
const store = useStore();
const auth = inject('auth');

const units = ref([])

const search = ref('')
const loadingSearch = ref(false)
const selected = ref(null)
const selectedPerson = ref(null)
const userProfile = JSON.parse(auth.remember())

onMounted(() => {
    console.log(props.name)
    console.log(userProfile.central_id)
})

const searchUnitsMethod = async (val) => {
    if(!val) {
        units.value = []
        return;
    }
    loadingSearch.value = true
    // const { data, load } = query(`file-manager-v2/lms-file-manager/search?search=${val}&tokenFM=${accessToken()}`);
    const result = await searchUnits(userProfile.central_id, val);
    // await load();
    units.value = result.results;
    loadingSearch.value = false
}

const handleSelectedUser = (val) => {

    search.value = null
    selected.value = null
    selectedPerson.value = null
    emitter.emit('SELECTED_UNIT', val)
    return null;
}

watch(search, (val) => {
    if(!val) {
        units.value = []
        return;
    }
    searchUnitsMethod(val)
})

</script>
<template>
    <Combobox as="div" v-model="selectedPerson">
        <ComboboxLabel class="block text-sm text-left font-medium text-gray-800">Assigned to</ComboboxLabel>
        <div class="flex flex-nowrap" v-if="statusHasDealer && checkUserRole(userRole)">
            <ComboboxLabel class="block text-sm font-medium text-gray-700">Filter By: </ComboboxLabel>
            <select id="filter" v-model="searchFilter" @change="handleChangeFilter" name="filter"
                class=" px-2 ml-5 h-8 text-sm rounded-md border border-gray-300 text-gray-500 bg-white py-2 pl-3 pr-10 shadow-sm sm:text-sm">
                <option value="user">User</option>
                <option value="dealer">Dealer</option>
                <!-- <option value="all">All</option> -->
            </select>
        </div>
        <div class="relative mt-1">
            <ComboboxInput
                class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
                @change="search = $event.target.value" :display-value="(person) => person?.name" placeholder="Search here...." />
            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </ComboboxButton>
    
            <ComboboxOptions v-loading="loading"
                class="absolute z-10  mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ComboboxOption v-for="unit in units" :key="unit.id" :value="unit" as="template"
                    v-slot="{ active, selected }" @click="handleSelectedUser(unit)">
                    <li
                        :class="['text-left relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-gray-600 text-white' : 'text-gray-900']">
                        <span :class="['block truncate', selected && 'font-semibold']">
                            {{ unit.name }}
                        </span>
    
                        <span v-if="selected"
                            :class="[' inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-gray-600']">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                    </li>
                </ComboboxOption>
            </ComboboxOptions>
        </div>
    </Combobox>
</template>
<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-10 " @close="open = false">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed  inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full  items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative transform  h-full rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-3/5 sm:p-6">
                            <div>
                                <div
                                    class="mx-auto flex h-12 w-full items-center justify-center rounded-full ">
                                    Assigned unit to users
                                </div>
                                <div class="mt-3 text-center h-full sm:mt-5">
                                    <div class="mt-2 h-full flex mb-5">
                                        <div class="w-2/4 h-full shadow-xl">
                                            <p class="text-md text-gray-500">
                                                {{unit.name}}
                                            </p>
                                            <img :src="unit.thumbnail" :alt="unit.name"
                                            class="h-full w-full mt-5" />
                                        </div>
                                        <div class="w-2/4 p-2">
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
                                                        class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                                        @change="search = $event.target.value" :display-value="(person) => person?.name" />
                                                    <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                                        <ChevronDoubleUpIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    </ComboboxButton>
                                            
                                                    <ComboboxOptions v-loading="loading"
                                                        class="absolute z-10  mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                        <ComboboxOption v-for="person in users" :key="person.id" :value="person" as="template" v-slot="{ active, selected }"
                                                            @click="handleSelectedUser(person)">
                                                            <li
                                                                :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-gray-900']">
                                                                <span :class="['block truncate', selected && 'font-semibold']">
                                                                    {{ person.name }} {{person.email ? ' - ' +person.email : ''}}
                                                                </span>
                                                    
                                                                <span v-if="selected"
                                                                    :class="[' inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-600']">
                                                                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            </li>
                                                        </ComboboxOption>
                                                    </ComboboxOptions>
                                                </div>
                                            </Combobox>
                                            <div>
                                                <fieldset class="space-y-5">
                                                    <div class=" flex items-start" v-if="searchFilter == 'user'">
                                                        <div class="flex h-5 items-center">
                                                            <input id="comments" v-model="allUsers" aria-describedby="comments-description" name="comments"
                                                                type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                                        </div>
                                                        <div class="ml-3 text-sm">
                                                            <label for="comments" class="font-medium text-gray-700">All Users</label>
                                                        </div>
                                                    </div>
                                                    <div v-if="searchFilter == 'dealer' && statusHasDealer && checkUserRole(userRole)" class=" flex items-start">
                                                        <div class="flex h-5 items-center">
                                                            <input id="candidates" v-model="allDealers" aria-describedby="candidates-description" name="candidates"
                                                                type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                                        </div>
                                                        <div class="ml-3 text-sm">
                                                            <label for="candidates" class="font-medium text-gray-700">All Dealers</label>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </div>
                                            <div class="mt-4 flex flex-col ">
                                                <div class="-my-2 -mx-4 overflow-y-scroll h-full sm:-mx-6 lg:-mx-8">
                                                    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                            <table v-loading="loadingAssignedUsers" class="min-w-full divide-y divide-gray-300">
                                                                <thead class="bg-gray-50">
                                                                    <tr>
                                                                        <th scope="col"
                                                                            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                            Name</th>
                                                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                            Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody class="bg-white">
                                                                    <tr v-for="(user, index) in assignedUsers" :key="index"
                                                                        :class="index % 2 === 0 ? undefined : 'bg-gray-50'">
                                                                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                            {{ user.name ? user.name : user.useable.name }}
                                                                            {{ getUserEmail(user)}}
                                                                        </td>
                                                                        <td @click="handleClickRemovedAssigned(index, user)"
                                                                            class="flex whitespace-nowrap px-3 py-4 cursor-pointer text-sm text-gray-500">
                                                                            <TrashIcon class="w-5 " />
                                                                            Remove
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <button type="button"
                                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                    @click="open = false">Assign</button>
                                <button type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                    @click="open = false" ref="cancelButtonRef">Cancel</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>

import { computed, onMounted, ref, watch } from 'vue'
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxLabel,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckIcon, ChevronDoubleUpIcon, TrashIcon } from '@heroicons/vue/outline'
import { useEmitter } from '@/composables/useEmitter';
import { useStore } from 'vuex';
import { fetch, fetchById } from '@/composables/resource_service';

const store = useStore();
const emitter = useEmitter;
const open = ref(false)
const unit = ref({
    id: null,
    name: null,
    thumbnail: null,
})
const statusHasDealer = ref(false);
const userProfile = computed(() => store.state.userProfile)
const userRole = computed(() => store.state.userProfile.roles);
const searchFilter = ref('user')
const loading = ref(false);
const users = ref([])
const assignedUsers = ref([])
const people = [
    { id: 1, name: 'Leslie Alexander' },
    // More users...
]

const loadingAssignedUsers = ref(false)

const search = ref('')
const selectedPerson = ref(null)
const allUsers = ref(false)
const allDealers = ref(false)
const removedUser = ref([])

const checkUserRole = (userRole) => {
    const accountManager = userRole.find(role => role.name == 'account-manager')
    const admin = userRole.find(role => role.name == 'super-admin' || role.name == 'super-administrator')
    if (accountManager) {
        return true
    }
    else if (admin) {
        return true
    }
    else {
        return false
    }
}

const hasSpecificDealer = async () => {
    const { data, load } = fetchById('/user/company/has-dealer', userProfile.value.company_id)
    await load();
    console.log('hasCompany', data.value)
    statusHasDealer.value = data.value
    return data.value ? true : false;
}

const handleClickRemovedAssigned = (index, user) => {
    assignedUsers.value.splice(index, 1);
    if (user.status != 'new') {
        removedUser.value.unshift(user);
    }
}


const getUserEmail = (user) => {
    if (user.email) {
        return ' - ' + user.email
    }
    else if (user.useable) {
        return user.useable.email ? ' - ' + user.useable.email : ''
    }
    else {
        return ''
    }
}

const handleChangeFilter = () => {
    allUsers.value = false
    allDealers.value = false
    // assignedUsers.value = assignedUsers.value.filter(user => user.status == 'old')
    users.value = []
}

const handleSelectedUser = (user) => {
    user.status = 'new';
    assignedUsers.value.unshift(user)
    search.value = '';
    selectedPerson.value = null
}

const searchUsers = async (query) => {
    loading.value = true;
    const { load, data } = fetch(`/user/setting/search`, `${query}&type=${searchFilter.value}`)
    await load();
    users.value = data.value
    loading.value = false
}
const handleInitializedVariables = () => {
    assignedUsers.value = []
    users.value = []
    allUsers.value = false
    allDealers.value = false
}

onMounted( async () => {
    emitter.on('ASSIGNED_LMS', async (data) => {
        open.value = true
        unit.value = data
        handleInitializedVariables()
        await hasSpecificDealer()
    })
})

watch(search, (val) => {
    if(val) {
        searchUsers(val)
        return;
    }
    loading.value = false
    users.value = []
})
</script>
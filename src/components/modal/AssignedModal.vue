<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative h-96 z-10" @close="open = false">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class=" relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-6/12 sm:p-6">
                            <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                <button type="button"
                                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                    @click="open = false">
                                    <span class="sr-only">Close</span>
                                    <XCircleIcon class="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div class="sm:flex w-full h-1/2 sm:items-start min-h-min">
                                <div
                                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <FolderAddIcon class="h-6 w-6 text-gray-600" aria-hidden="true" />
                                </div>
                                <div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">{{ isUpdate
                                    ? "Rename Folder" : `Assigned user/s in ${file.name}`
                                    }}</DialogTitle>
                                    <div class="mt-2 w-full">
                                        <!-- oontent her -->
                                        <div class="sm:flex sm:items-center">
                                            <div class="sm:flex-auto relative">
                                                 <Combobox as="div" v-model="search" class="w-full">
                                                    
                                                    <div v-if="statusHasDealer && checkUserRole(userRole)">
                                                        <ComboboxLabel class="block text-sm font-medium text-gray-700">Filter By: </ComboboxLabel>
                                                        <select id="filter" v-model="searchFilter" @change="handleChangeFilter" name="filter" 
                                                            class=" px-2 rounded-md border border-gray-300 text-gray-500 bg-white py-2 pl-3 pr-10 shadow-sm sm:text-sm">
                                                            <option value="user">User</option>
                                                            <option value="dealer">Dealer</option>
                                                            <!-- <option value="all">All</option> -->
                                                        </select>
                                                    </div>
                                                    <div class="relative mt-1">
                                                    <ComboboxInput placeholder="Search user" class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm sm:text-sm" @change="query = $event.target.value" :display-value="(person) => person?.name" />
                                                    <ComboboxButton class=" inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                                        <ChevronDoubleUpIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    </ComboboxButton>

                                                    <ComboboxOptions v-loading="loading" class=" mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                        <ComboboxOption v-for="person in users" :key="person.id" :value="person" as="template" v-slot="{ active, selected }" @click="handleSelectedUser(person)">
                                                        <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-gray-900']">
                                                            <span :class="['block truncate', selected && 'font-semibold']">
                                                            {{ person.name }} {{person.email ? ' - ' +person.email : ''}}
                                                            </span>

                                                            <span v-if="selected" :class="[' inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-600']">
                                                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        </li>
                                                        </ComboboxOption>
                                                    </ComboboxOptions>
                                                    </div>
                                                </Combobox>
                                                <div>
                                                    <!-- <fieldset class="mt-4">
                                                        <div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10" :key="refreshKey">
                                                            <div v-for="(assigned, index) in filterAssignedUsersData" :key="index" 
                                                                class="flex items-center">
                                                                <input name="filterUser" @change="onChangeAssignedUser($event)" type="radio"
                                                                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" :value="assigned.title"/>
                                                                <label :for="assigned.id" class="ml-3 block text-sm font-medium text-gray-700">{{
                                                                assigned.title }}</label>
                                                            </div>
                                                        </div>
                                                    </fieldset> -->
                                                    <fieldset class="space-y-5" :key="refreshKey">
                                                        <div class=" flex items-start" v-if="searchFilter == 'user'">
                                                            <div class="flex h-5 items-center">
                                                                <input id="comments" v-model="allUsers" aria-describedby="comments-description" name="comments" type="checkbox"
                                                                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                                            </div>
                                                            <div class="ml-3 text-sm">
                                                                <label for="comments" class="font-medium text-gray-700">All Users</label>
                                                            </div>
                                                        </div>
                                                        <div v-if="searchFilter == 'dealer' && statusHasDealer && checkUserRole(userRole)" class=" flex items-start">
                                                            <div class="flex h-5 items-center">
                                                                <input id="candidates" v-model="allDealers"  aria-describedby="candidates-description" name="candidates" type="checkbox"
                                                                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                                            </div>
                                                            <div class="ml-3 text-sm">
                                                                <label for="candidates" class="font-medium text-gray-700">All Dealers</label>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <!-- <h1 class="text-xl font-semibold text-gray-900">Users</h1> -->
                                            </div>
                                            <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                                                <!-- <h2 class="text-md"> Users</h2> -->
                                            </div>
                                        </div>
                                        <div class="mt-4 flex flex-col">
                                            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                    <div
                                                        class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                        <table v-loading="loadingAssignedUsers" class="min-w-full divide-y divide-gray-300">
                                                            <thead class="bg-gray-50">
                                                                <tr>
                                                                    <th scope="col"
                                                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                        Name</th>
                                                                    <!-- <th scope="col"
                                                                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                        Permission Level</th> -->
                                                                    <th scope="col"
                                                                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                        Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody class="bg-white">
                                                                <tr v-for="(user, index) in assignedUsers" :key="index"
                                                                    :class="index % 2 === 0 ? undefined : 'bg-gray-50'">
                                                                    <td
                                                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                        {{ user.name ? user.name : user.useable.name }}
                                                                        {{ getUserEmail(user)}}
                                                                    </td>
                                                                    <!-- <td
                                                                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                        {{ user.email ? user.email : user.to_user.email }}</td> -->
                                                                    <!-- <td
                                                                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                        <select id="location" v-model="user.user_status" @change="handleChangeUserStatus" name="location" class=" w-full py-2 rounded-md border border-gray-800 text-base sm:text-sm">
                                                                            <option value="read_write" selected>Read/Write</option>
                                                                            <option value="read">Read</option>
                                                                        </select>    
                                                                    </td> -->
                                                                    <td
                                                                        @click="handleClickRemovedAssigned(index, user)"
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
                                        <!-- end of content -->
                                    </div>
                                </div>
                            </div>
                            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button type="button"
                                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                    @click="handleAddAssignedUserClick()">{{ isUpdate ? "Save" : "Save"}}</button>
                                <button type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="open = false">Cancel</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <!-- Mobile Dialog Here -->
    <TransitionRoot as="template" :show="isMobilePopup">
        <Dialog as="div" class="relative h-96 z-10" @close="isMobilePopup = false">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>
    
            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class=" relative w-full transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                <button type="button"
                                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                    @click="isMobilePopup = false">
                                    <span class="sr-only">Close</span>
                                    <XCircleIcon class="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div class="sm:flex w-full sm:items-start min-h-min">
                                <div
                                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <FolderAddIcon class="h-6 w-6 text-gray-600" aria-hidden="true" />
                                </div>
                                <div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">{{ isUpdate
                                        ? "Rename Folder" : `Assigned user/s in ${file.name}`
                                        }}</DialogTitle>
                                    <div class="mt-2 w-full">
                                        <!-- oontent her -->
                                        <div class="sm:flex sm:items-center">
                                            <div class="sm:flex-auto">
                                                <Combobox as="div" v-model="search" class="w-full">
                            
                                                    <div v-if="statusHasDealer && checkUserRole(userRole)">
                                                        <ComboboxLabel class="block text-sm font-medium text-gray-700">Filter By: </ComboboxLabel>
                                                        <select id="filter" v-model="searchFilter" @change="handleChangeFilter" name="filter"
                                                            class=" px-2 rounded-md border border-gray-300 text-gray-500 bg-white py-2 pl-3 pr-10 shadow-sm sm:text-sm">
                                                            <option value="user">User</option>
                                                            <option value="dealer">Dealer</option>
                                                            <!-- <option value="all">All</option> -->
                                                        </select>
                                                    </div>
                                                    <div class="relative mt-1">
                                                        <ComboboxInput placeholder="Search user"
                                                            class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm sm:text-sm"
                                                            @change="query = $event.target.value" :display-value="(person) => person?.name" />
                                                        <ComboboxButton
                                                            class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                                            <ChevronDoubleUpIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                        </ComboboxButton>
                            
                                                        <ComboboxOptions v-loading="loading"
                                                            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                            <ComboboxOption v-for="person in users" :key="person.id" :value="person" as="template"
                                                                v-slot="{ active, selected }" @click="handleSelectedUser(person)">
                                                                <li
                                                                    :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-gray-900']">
                                                                    <span :class="['block truncate', selected && 'font-semibold']">
                                                                        {{ person.name }} {{person.email ? ' - ' +person.email : ''}}
                                                                    </span>
                            
                                                                    <span v-if="selected"
                                                                        :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-600']">
                                                                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                </li>
                                                            </ComboboxOption>
                                                        </ComboboxOptions>
                                                    </div>
                                                </Combobox>
                                                <div>
                                                    <!-- <fieldset class="mt-4">
                                                                                    <div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10" :key="refreshKey">
                                                                                        <div v-for="(assigned, index) in filterAssignedUsersData" :key="index" 
                                                                                            class="flex items-center">
                                                                                            <input name="filterUser" @change="onChangeAssignedUser($event)" type="radio"
                                                                                                class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" :value="assigned.title"/>
                                                                                            <label :for="assigned.id" class="ml-3 block text-sm font-medium text-gray-700">{{
                                                                                            assigned.title }}</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </fieldset> -->
                                                    <fieldset class="space-y-5" :key="refreshKey">
                                                        <div class=" flex items-start" v-if="searchFilter == 'user'">
                                                            <div class="flex h-5 items-center">
                                                                <input id="comments" v-model="allUsers" aria-describedby="comments-description"
                                                                    name="comments" type="checkbox"
                                                                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                                            </div>
                                                            <div class="ml-3 text-sm">
                                                                <label for="comments" class="font-medium text-gray-700">All Users</label>
                                                            </div>
                                                        </div>
                                                        <div v-if="searchFilter == 'dealer' && statusHasDealer && checkUserRole(userRole)"
                                                            class=" flex items-start">
                                                            <div class="flex h-5 items-center">
                                                                <input id="candidates" v-model="allDealers"
                                                                    aria-describedby="candidates-description" name="candidates" type="checkbox"
                                                                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                                            </div>
                                                            <div class="ml-3 text-sm">
                                                                <label for="candidates" class="font-medium text-gray-700">All Dealers</label>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <!-- <h1 class="text-xl font-semibold text-gray-900">Users</h1> -->
                                            </div>
                                            <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                                                <!-- <h2 class="text-md"> Users</h2> -->
                                            </div>
                                        </div>
                                        <div class="mt-4 flex flex-col">
                                            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                        <table v-loading="loadingAssignedUsers" class="min-w-full divide-y divide-gray-300">
                                                            <thead class="bg-gray-50">
                                                                <tr>
                                                                    <th scope="col"
                                                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                        Name</th>
                                                                    <!-- <th scope="col"
                                                                                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                                                    Permission Level</th> -->
                                                                    <th scope="col"
                                                                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                        Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody class="bg-white">
                                                                <tr v-for="(user, index) in assignedUsers" :key="index"
                                                                    :class="index % 2 === 0 ? undefined : 'bg-gray-50'">
                                                                    <td
                                                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                        {{ user.name ? user.name : user.useable.name }}
                                                                        {{ getUserEmail(user)}}
                                                                    </td>
                                                                    <!-- <td
                                                                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                        {{ user.email ? user.email : user.to_user.email }}</td> -->
                                                                    <!-- <td
                                                                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                        <select id="location" v-model="user.user_status" @change="handleChangeUserStatus" name="location" class=" w-full py-2 rounded-md border border-gray-800 text-base sm:text-sm">
                                                                            <option value="read_write" selected>Read/Write</option>
                                                                            <option value="read">Read</option>
                                                                        </select>    
                                                                    </td> -->
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
                                        <!-- end of content -->
                                    </div>
                                </div>
                            </div>
                            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button type="button"
                                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                    @click="handleAddAssignedUserClick()">{{ isUpdate ? "Save" : "Save"}}</button>
                                <button type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="isMobilePopup = false">Cancel</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
<script>
import { useEmitter } from "@/composables/useEmitter";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { FolderAddIcon, XCircleIcon, TrashIcon } from "@heroicons/vue/solid"
import { fetch, fetchById, store } from "@/composables/resource_service";
// import { store, update } from "@/composables/resource_service";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'
import { CheckIcon, ChevronDoubleUpIcon } from '@heroicons/vue/solid'
import { useStore } from "vuex";


export default defineComponent({
    name: "AssignedModal",
    props: {
        isAssigned: {
            type: Boolean,
            default: false
        }
    },
    components: {
        DialogPanel,
        DialogTitle,
        Dialog,
        TransitionChild,
        TransitionRoot,
        FolderAddIcon, XCircleIcon,
        TrashIcon,
        Combobox,
        ComboboxLabel,
        ComboboxOption,
        ComboboxOptions,
        ComboboxButton,
        ComboboxInput,
        CheckIcon,
        ChevronDoubleUpIcon
    },
    setup(props) {
        // const auth = inject('auth');
        // const user = JSON.parse(auth.remember())
        const assignedUser = ref(false)
        const file = ref({});
        const fileType = ref(null);
        const isUpdate = ref(false)
        const emitter = useEmitter;
        const storeVuex = useStore()
        const search = ref('')
        const searchFilter = ref('user')

        const form = ref({
            name: "",
            parent_id: "",
        })

        const showAssigneModal = computed(() => props.isAssigned);

        const refreshKey = ref(0)

        const users = ref([])
        const assignedUsers = ref([]);
        const loading = ref(false)

        const hasError = ref(false)
        const error = ref({})
        const removedUser = ref([]);
        const loadingAssignedUsers = ref(false);
        const isMobilePopup = ref(false)
        const userProfile = computed(() => storeVuex.state.userProfile)
        const statusHasDealer = ref(false);
        const assingedUsersData = ref([
            { title: 'All Users' },
            { title: 'All Dealers' },
            // { title: 'Select Dealer' },
        ])
        const allUsers = ref(false);
        const allDealers = ref(false);

        const filterAssignedUsersData = computed(() => {
            
            if (statusHasDealer.value) {
                if (searchFilter.value == 'dealer') {
                    return assingedUsersData.value.filter(user => user.title != 'All Users')
                }
                else if (searchFilter.value == 'user') {
                    return assingedUsersData.value.filter(user => user.title != 'All Dealers')
                }
                else {
                    return assingedUsersData.value
                }
                
            }
            else {
                return assingedUsersData.value.filter((user) => user.title != 'All Dealers' && user.title != 'Select Dealer')
            }
        })

        const handleAddAssignedUserClick = async () => {

            const {data, post} = 
                store('/user/assigned/assigned-folder',
                    {
                        file_id: file.value.id,
                        assigned_users: assignedUsers.value,
                        remove_users: removedUser.value,
                        type: fileType.value
                    }
                );
            await post();
            emitter.emit('NEW_ASSIGNED_USERS', data.value.new_assigned)
            emitter.emit('DELETED_USERS', data.value.deleted_users)
            open.value = false
            emitter.emit('NOTIFICATION', {
                message: isUpdate.value ? 'Successfully updated' : 'Successfully added',
                type: "success",
                mode: isUpdate.value ? 'update' : 'store'
            })
        }

        const open = ref(false)
        const query = ref('')

        const remoteMethod = (query) => {
            if (query) {
                searchUsers(query)
            } else {
                users.value = []
            }
        }

        const loadAssignedUsersForFolder = async () => {
            loadingAssignedUsers.value = true
            const {load, data} = fetchById(`/user/assigned/assigned-users-folder/${file.value.id}`, 'folder');
            await load();
            assignedUsers.value = data.value;
            loadingAssignedUsers.value = false
        }

        const loadAssignedUsersForFile = async () => {
            loadingAssignedUsers.value = true
            const {load, data} = fetchById(`/user/assigned/assigned-users-folder/${file.value.id}`, 'file');
            await load();
            assignedUsers.value = data.value;
            loadingAssignedUsers.value = false
        }

        const handleChangeUser = (user_id) => {
            const user = users.value.find(user => user.id == user_id);
            user.user_status = 'read_write';
            user.status = 'new'
            assignedUsers.value.unshift(user);
            search.value = '';
            users.value = [];
        }

        const handleClickRemovedAssigned = (index, user) => {
            assignedUsers.value.splice(index, 1);
            if(user.status != 'new') {
                removedUser.value.unshift(user);
            }
        }

        const onChangeAssignedUser = async (event) => {
            let data = event.target.value
            assignedUsers.value = assignedUsers.value.filter(user => user.status == 'old');
            if(data == 'All Users') {
                loadingAssignedUsers.value = true
                const {data, load} = fetch('/user/setting/all-users')
                await load();
                if (assignedUsers.value.length > 0) {
                    data.value.forEach((newAssignedUser) => {
                        newAssignedUser.user_status = 'read_write';
                        newAssignedUser.status = 'new'
                        let isAssigned = assignedUsers.value.find(user => user.to_user_id == newAssignedUser.id);
                        if (!isAssigned) {
                            assignedUsers.value.unshift(newAssignedUser);
                        } 
                    })
                }
                else {
                    assignedUsers.value = data.value.map(user => {
                        user.user_status = 'read_write';
                        user.status = 'new'
                        return user
                    })
                }
                
                loadingAssignedUsers.value = false                
            }
            else if (data == 'All Dealers') {
                loadingAssignedUsers.value = true
                const {data, load} = fetch('/user/setting/all-dealers');
                await load();
                console.log(data.value);
                if(assignedUsers.value.length > 0) {
                    data.value.forEach((newAssignedUser) => {
                        newAssignedUser.user_status = 'read_write';
                        newAssignedUser.status = 'new'
                        let isAssigned = assignedUsers.value.find(user => user.to_user_id == newAssignedUser.id);
                        if (!isAssigned) {
                            assignedUsers.value.unshift(newAssignedUser);
                        }   
                    })
                }
                else {
                    assignedUsers.value = data.value.map(user => {
                        user.user_status = 'read_write';
                        user.status = 'new'
                        return user
                    })
                }
                loadingAssignedUsers.value = false
            } else {
                console.log(data)
            }
        }

        const searchUsers = async (query) => {
            loading.value = true;
            const { load, data } = fetch(`/user/setting/search`, `${query}&type=${searchFilter.value}`)
            await load();
            users.value = data.value.map((user) => {
                assignedUsers.value.forEach((ass) => {
                    if(ass && ass.to_user_id) {
                        if(user.id != ass.to_user_id) {
                            user.disable = true
                        } 
                        else {
                            user.disable = false
                        }
                    }
                    else {
                        if(ass.id == user.id) {
                            user.disable = true
                        }
                        else {
                            user.disable = false
                        }
                    }
                })
 
                return user;
            })
            loading.value = false
        }

        const handleChangeUserStatus = (value) => {
            console.log(value)
            
        }

        const handleSelectedUser = (value) => {
            value.user_status = 'read_write';
            value.status = 'new';
            if(searchFilter.value == 'user') {
                value.assigned_status = 'user'
            }
            else {
                value.assigned_status ='dealer';
            }
            assignedUsers.value.unshift(value);
            search.value = '';
        }

        const hasSpecificDealer = async () => {
            const { data, load } = fetchById('/user/company/has-dealer', userProfile.value.company_id)
            await load();
            console.log('hasCompany', data.value)
            statusHasDealer.value = data.value
            return data.value ? true : false;
        }

        const handleChangeFilter = () => {
            allUsers.value = false
            allDealers.value = false
            // assignedUsers.value = assignedUsers.value.filter(user => user.status == 'old')
        }

        const getUserEmail = (user) => {
            if(user.email) {
                return ' - ' +user.email
            }
            else if (user.useable) {
                return user.useable.email ? ' - ' + user.useable.email : ''
            }
            else {
                return ''
            }
        }

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

        watch(query, (val) => {
            if(val != '') {
                searchUsers(val);
            }
            else {
                users.value = []
            }
        })

        watch(allUsers, async (val) => {
            if(val) {
                loadingAssignedUsers.value = true
                const { data, load } = fetch('/user/setting/all-users')
                await load();
                if (assignedUsers.value.length > 0) {
                    data.value.forEach((newAssignedUser) => {
                        newAssignedUser.user_status = 'read_write';
                        newAssignedUser.status = 'new',
                        newAssignedUser.assigned_status = 'user'
                        let isAssigned = assignedUsers.value.find(user => user.to_user_id == newAssignedUser.id);
                        if (!isAssigned) {
                            assignedUsers.value.unshift(newAssignedUser);
                        }
                    })
                }
                else {
                    assignedUsers.value = data.value.map(user => {
                        user.user_status = 'read_write';
                        user.status = 'new'
                        user.assigned_status = 'user'
                        return user
                    })
                }

                loadingAssignedUsers.value = false    
            }
            else {
                assignedUsers.value = assignedUsers.value.filter(user => user.status == 'old')
            }
        })

        watch(allDealers, async (val) => {
            if(val) {
                loadingAssignedUsers.value = true
                const { data, load } = fetch('/user/setting/all-dealers');
                await load();
                console.log(data.value);
                if (assignedUsers.value.length > 0) {
                    data.value.forEach((newAssignedUser) => {
                        newAssignedUser.user_status = 'read_write';
                        newAssignedUser.status = 'new'
                        newAssignedUser.assigned_status = 'dealer'
                        let isAssigned = assignedUsers.value.find(user => user.to_user_id == newAssignedUser.id);
                        if (!isAssigned) {
                            assignedUsers.value.unshift(newAssignedUser);
                        }
                    })
                }
                else {
                    assignedUsers.value = data.value.map(user => {
                        user.user_status = 'read_write';
                        user.status = 'new'
                        user.assigned_status = 'dealer'
                        return user
                    })
                }
                loadingAssignedUsers.value = false
            }
            else {
                assignedUsers.value = assignedUsers.value.filter(user => user.status == 'old')
            }
        })

        onMounted( async() => {
            emitter.on('ASSIGNED_USER', async ({ data, type, isFromMobile }) => {
                console.log('test')
                await hasSpecificDealer();
                assignedUser.value = true
                fileType.value = type;
                file.value = data;
                isUpdate.value = false
                if (!isFromMobile) {
                    open.value = true
                }
                else {
                    isMobilePopup.value = true
                }
                
                error.value = {}

                if(fileType.value === 'folder') {
                    await loadAssignedUsersForFolder();
                }
                else {
                    await loadAssignedUsersForFile();
                }
                allUsers.value = false;
                allDealers.value = false;
            })
        })

        return {
            assignedUser,
            isUpdate,
            open,
            handleAddAssignedUserClick,
            form,
            error,
            hasError,
            file,
            fileType,
            users,
            search,
            remoteMethod,
            loading,
            assignedUsers,
            handleChangeUser,
            handleClickRemovedAssigned,
            handleChangeUserStatus,
            loadingAssignedUsers,
            removedUser,
            query,
            handleSelectedUser,
            isMobilePopup,
            assingedUsersData,
            userProfile,
            hasSpecificDealer,
            filterAssignedUsersData,
            statusHasDealer,
            onChangeAssignedUser,
            getUserEmail,
            searchFilter,
            handleChangeFilter,
            refreshKey,
            userRole: computed(() => storeVuex.state.userProfile.roles),
            checkUserRole,
            allUsers,
            allDealers,
            showAssigneModal
        }
    }
})
</script>
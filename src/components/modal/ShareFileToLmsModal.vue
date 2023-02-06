<script setup>
import { onMounted, defineProps, ref } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useEmitter } from '@/composables/useEmitter';
import {
    DocumentTextIcon,
    FolderIcon,
    TrashIcon
} from '@heroicons/vue/solid'
import SearchUnits from '../lms/SearchUnits.vue';
import InputPasswordForm from '../ui/InputPasswordForm.vue';
import { query, store } from '@/composables/resource_service';
import { accessToken } from '@/composables/local_storage';

    const props = defineProps({
        file: {
            type: Object,
            default: null
        },
        isOpenModal: {
            type: Boolean,
            default: false
        }
    });

    const emitter = useEmitter;

    const open = ref(false)
    const openMobile = ref(false)
    const selectedFile = ref(null)
    const isMobileOpen = ref(false)
    const selectedType = ref(null)
    const selectedUnits = ref([]);
    const removeUnits = ref([])
    const isProtected = ref(false)
    const password = ref(null)
    const loadingStore = ref(false)
    const hasProtect = ref(false)
    const refreshKey = ref(0)
    const useOldPassword = ref(false)
    const oldPassword = ref(null)

    const fileIcon = () => {
        return DocumentTextIcon;
    }

    const initializeData = () => {
        open.value = false;
        selectedFile.value = null;
        selectedUnits.value = [];
        isProtected.value = false;
        removeUnits.value = [];
        password.value = null;
        isMobileOpen.value = false;
    }

    const isPicture = (file) => {
        if (file && file.mimetype) {
            if (file.mimetype == 'png') {
                return true
            }
            else if (file.mimetype == 'gif') {
                return true
            }
            else if (file.mimetype == 'jpg') {
                return true;
            }
            else if (file.mimetype == 'jpeg') {
                return true;
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    }

    const handleClickRemovedAssigned = (index, unit) => {
        selectedUnits.value.splice(index, 1)
        if(unit.status != 'new') {
            removeUnits.value.unshift(unit)
        }
    }

    const handleFetchUntsFile = async () => {
        const { data, load } = query(`/user/share/units?type=${selectedType.value}&id=${selectedFile.value.id}`);
        await load();
        selectedUnits.value = data.value;
        if(selectedUnits.value.length > 0) {
            const isProtected = selectedUnits.value.filter(unit => unit.is_protected == 1);
            if(isProtected) {
                hasProtect.value = true;
                useOldPassword.value = true
                oldPassword.value = isProtected[0].password;
            }
        }

        if(hasProtect.value) {
            isProtected.value = true
        }
        else {
            isProtected.value = false
        }
    }

    const handleClickShare = async () => {
        loadingStore.value = true
        const {data, post} = store('/user/share/store', {
            password: useOldPassword.value ? oldPassword.value : password.value,
            isProtected: isProtected.value,
            removeUnits: removeUnits.value,
            selectedUnits: selectedUnits.value.reverse(),
            file_id: selectedFile.value.id,
            type: selectedType.value,
            tokenFM: accessToken()
        })
        await post();
        console.log(data.value);
        loadingStore.value = false
        open.value = false
        emitter.emit('SHARED_FILE')
    }

    const handleClickCancel = () => {   
        open.value = false
        openMobile.value = false
    }

    onMounted( async () => {
        console.log(props)

        emitter.on('SHARED_UNIT', async (selected) => {
            selectedFile.value = selected.data
            isMobileOpen.value = selected.isFromMobile
            selectedType.value = selected.type
            selectedUnits.value = []
            isProtected.value = false
            refreshKey.value++
            hasProtect.value = false
            useOldPassword.value = false
            oldPassword.value = null;
            
            if(selected.isFromMobile) {
                openMobile.value = true
            }
            else {
                open.value = true
            }

            await handleFetchUntsFile();
        })

        emitter.on('SELECTED_UNIT', data => {
            data.status = 'new';
            let isSelected = selectedUnits.value.filter(selected => selected.id != data.id);
            selectedUnits.value.unshift(data)
        })
    })
</script>
<template>
    <TransitionRoot as="template" :show="open" :key="refreshKey">
        <Dialog as="div" class="relative z-10 " >
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
                                <div class="mx-auto flex h-12 w-full items-center justify-center rounded-full ">
                                    Share to units
                                </div>
                                <div class="mt-3 text-center h-full sm:mt-5">
                                    <div class="mt-2 h-full flex mb-5">
                                        <div class="w-2/4 h-full shadow-xl">
                                            <!-- file here -->
                                            <p class="text-md text-gray-500">
                                                {{ selectedFile.name }}
                                            </p>

                                            <FolderIcon v-if="selectedType === 'folder'" class="object-cover text-gray-300" />
                                            <img :src="selectedFile.url" alt="" class="object-cover"
                                                v-else-if="selectedType !== 'folder' && isPicture(selectedFile)" />
                                            <component v-else :is="fileIcon(file)" class="mx-auto h-full w-full flex-shrink-0 text-gray-300" aria-hidden="true" />
                                        </div>
                                        <div class="w-2/4 p-2">
                                            <!-- lms units here -->
                                            <SearchUnits/>
                                            <!-- <div class="flex items-start mt-4">
                                                <div class=" flex items-start">
                                                    <div class="flex h-5 items-center">
                                                        <input id="comments" v-model="isProtected" aria-describedby="comments-description" name="comments"
                                                            type="checkbox" class="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500" />
                                                    </div>
                                                    <div class="ml-3 text-sm">
                                                        <label for="comments" class="font-medium text-gray-700">Protect</label>
                                                    </div>

                                                    <div class="flex h-5 items-center" v-if="hasProtect">
                                                        <input id="comments" v-model="useOldPassword" aria-describedby="comments-description" name="comments" type="checkbox"
                                                            class="h-4 w-4 ml-5 rounded border-gray-300 text-gray-600 focus:ring-gray-500" />
                                                    </div>
                                                    <div class="ml-3 text-sm" v-if="hasProtect">
                                                        <label for="comments" class="font-medium text-gray-700">Use old password</label>
                                                    </div>
                                                </div>
                                                <div v-if="isProtected && !useOldPassword" class="ml-5">
                                                    <InputPasswordForm v-model="password" :type="'small'" :placeholder="'Password'"/>
                                                </div>
                                            </div> -->
                                            <div class="mt-4 flex flex-col h-full">
                                                <div class="-my-2 -mx-4 overflow-y-scroll h-96 sm:-mx-6 lg:-mx-8">
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
                                                                    <tr v-for="(unit, index) in selectedUnits" :key="index"
                                                                        :class="index % 2 === 0 ? undefined : 'bg-gray-50'">
                                                                        <td class="whitespace-nowrap text-left py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                            {{ unit.unit_name ? unit.unit_name : unit.name }}
                                                                        </td>
                                                                        <td @click="handleClickRemovedAssigned(index, unit)"
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
                                    :disabled="loadingStore"
                                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                    @click="handleClickShare">Share</button>
                                <button type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                    @click="handleClickCancel" ref="cancelButtonRef">Cancel</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <!-- mobile -->
    <TransitionRoot as="template" :show="openMobile" :key="refreshKey">
        <Dialog as="div" class="relative z-10 ">
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
                            class="relative transform  h-full rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-full sm:p-6">
                            <div>
                                <div class="mx-auto flex h-12 w-full items-center justify-center rounded-full ">
                                    Share to units
                                </div>
                                <div class="mt-3 text-center h-full sm:mt-5">
                                    <div class="mt-2 h-full mb-5">
                                        <div class="w-full h-full shadow-xl">
                                            <!-- file here -->
                                            <p class="text-md text-gray-500">
                                                {{selectedType == 'folder' ? 'Folder: ' : 'File: '}} {{ selectedFile.name }} 
                                            </p>
                                        </div>
                                        <div class="w-full p-2">
                                            <!-- lms units here -->
                                            <SearchUnits />
                                            <!-- <div class="flex items-start mt-4">
                                                    <div class=" flex items-start">
                                                        <div class="flex h-5 items-center">
                                                            <input id="comments" v-model="isProtected" aria-describedby="comments-description" name="comments"
                                                                type="checkbox" class="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500" />
                                                        </div>
                                                        <div class="ml-3 text-sm">
                                                            <label for="comments" class="font-medium text-gray-700">Protect</label>
                                                        </div>
    
                                                        <div class="flex h-5 items-center" v-if="hasProtect">
                                                            <input id="comments" v-model="useOldPassword" aria-describedby="comments-description" name="comments" type="checkbox"
                                                                class="h-4 w-4 ml-5 rounded border-gray-300 text-gray-600 focus:ring-gray-500" />
                                                        </div>
                                                        <div class="ml-3 text-sm" v-if="hasProtect">
                                                            <label for="comments" class="font-medium text-gray-700">Use old password</label>
                                                        </div>
                                                    </div>
                                                    <div v-if="isProtected && !useOldPassword" class="ml-5">
                                                        <InputPasswordForm v-model="password" :type="'small'" :placeholder="'Password'"/>
                                                    </div>
                                                </div> -->
                                            <div class="mt-4 flex flex-col h-full">
                                                <div class="-my-2 -mx-4 overflow-y-scroll h-96 sm:-mx-6 lg:-mx-8">
                                                    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                        <div
                                                            class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                                            <table v-loading="loadingAssignedUsers"
                                                                class="min-w-full divide-y divide-gray-300">
                                                                <thead class="bg-gray-50">
                                                                    <tr>
                                                                        <th scope="col"
                                                                            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                            Name</th>
                                                                        <th scope="col"
                                                                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                            Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody class="bg-white">
                                                                    <tr v-for="(unit, index) in selectedUnits" :key="index"
                                                                        :class="index % 2 === 0 ? undefined : 'bg-gray-50'">
                                                                        <td
                                                                            class="whitespace-nowrap text-left py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                            {{ unit.unit_name ? unit.unit_name : unit.name
                                                                            }}
                                                                        </td>
                                                                        <td @click="handleClickRemovedAssigned(index, unit)"
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
                                <button type="button" :disabled="loadingStore"
                                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                    @click="handleClickShare">Share</button>
                                <button type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                    @click="handleClickCancel" ref="cancelButtonRef">Cancel</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

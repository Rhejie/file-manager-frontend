<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-10" @close="open = false">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                <button type="button"
                                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                    @click="open = false">
                                    <span class="sr-only">Close</span>
                                    <XCircleIcon class="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div class="sm:flex w-full sm:items-start">
                                <div
                                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <FolderAddIcon class="h-6 w-6 text-gray-600" aria-hidden="true" />
                                </div>
                                <div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">{{ isUpdate
                                    ? "Rename Folder" : "Add Folder"
                                    }}</DialogTitle>
                                    <div class="mt-2 w-full">
                                        <div class="w-full">
                                            <div class="w-full h-full">
                                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                    Name
                                                </label>
                                                <div className="mt-1">
                                                    <input id="text" name="name" v-model="form.name" type="text"
                                                        placeholder="Folder Name" autoComplete="name" required
                                                        className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-lg" />

                                                    <span class="text-sm text-red-400"
                                                        v-if="error && error.name && error.name.length > 0">
                                                        {{ error.name[0] }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button type="button"
                                    :disabled="storing"
                                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                    @click="handleAddFolderClick()">
                                        {{ storing ? "Saving....." : "Save"}}
                                </button>
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
    <!-- Mobile Dialog -->
    <TransitionRoot as="template" :show="mobileOpen">
        <Dialog as="div" class="relative z-10" @close="mobileOpen = false">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative w-96 transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                <button type="button"
                                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                    @click="mobileOpen = false">
                                    <span class="sr-only">Close</span>
                                    <XCircleIcon class="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div class="sm:flex w-full sm:items-start">
                                <div
                                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <FolderAddIcon class="h-6 w-6 text-gray-600" aria-hidden="true" />
                                </div>
                                <div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">{{ isUpdate
                                    ? "Rename Folder" : "Add Folder"
                                    }}</DialogTitle>
                                    <div class="mt-2 w-full">
                                        <div class="w-full">
                                            <div class="w-full h-full">
                                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                    Name
                                                </label>
                                                <div className="mt-1">
                                                    <input id="text" name="name" v-model="form.name" type="text"
                                                        placeholder="Folder Name" autoComplete="name" required
                                                        className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-lg" />

                                                    <span class="text-sm text-red-400"
                                                        v-if="error && error.name && error.name.length > 0">
                                                        {{ error.name[0] }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button type="button"
                                    :disabled="storing"
                                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                    @click="handleAddFolderClick()">
                                    {{ storing ? "Saving....." : "Save"}}
                                </button>
                                <button type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="mobileOpen = false">Cancel</button>
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
import { defineComponent, inject, onMounted, ref } from "vue";
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { FolderAddIcon, XCircleIcon } from "@heroicons/vue/solid"
import { store, update } from "@/composables/resource_service";


export default defineComponent({
    name: "AddFolderModal",
    components: {
        DialogPanel,
        DialogTitle,
        Dialog,
        TransitionChild,
        TransitionRoot,
        FolderAddIcon, XCircleIcon
    },
    setup() {
        const auth = inject('auth');
        const user = JSON.parse(auth.remember())
        const addFolder = ref(false)
        const isUpdate = ref(false)
        const emitter = useEmitter;
        const isMobileDropdownPopup = ref(false)
        const storing = ref(false);

        const form = ref({
            name: "",
            parent_id: "",
            company_id: user.company_id,
            specific_dealer_id: user.specific_dealer_id,
        })

        const hasError = ref(false)
        const error = ref({})

        const mobileOpen = ref(false)

        const handleClose = () => {

        }

        const handleStoreFolder = async () => {
            const { post, data, errorValue } = store('/file-manager/folder/store', form.value);
            await post()
            hasError.value = errorValue.value ? true : false;
            if (hasError.value) {
                error.value = errorValue.value
            }
            else {
                emitter.emit('NEW_FOLDER', data.value)
            }
            storing.value = false

        }

        const handleUpdateFolder = async (id) => {
            storing.value = true
            const { post, data, errorValue } = update('/file-manager/folder/update', form.value, id)
            await post();
            hasError.value = errorValue.value ? true : false;
            if (hasError.value) {
                error.value = errorValue.value
            }
            else {

                if (data.value && data.value.id) {
                    console.log(data.value)
                    emitter.emit('UPDATED_FOLDER', data.value)
                }
            }

            storing.value = false
        }

        const handleAddFolderClick = async () => {
            storing.value = true
            if (!isUpdate.value) {
                await handleStoreFolder();
            }
            else {
                console.log('click')
                await handleUpdateFolder(form.value.id);
            }

            if (!hasError.value) {
                // emitter.emit('NOTIFICATION', {
                //     message: isUpdate.value ? 'Successfully updated' : 'Successfully added',
                //     type: "success",
                //     mode: isUpdate.value ? 'update' : 'store'
                // })
                open.value = false
            }
        }

        const open = ref(false)

        onMounted(() => {
            emitter.on('ADD_FOLDER', (folder_id) => {
                addFolder.value = true
                isUpdate.value = false
                open.value = true
                form.value.name = ""
                form.value.parent_id = folder_id
                error.value = {}
            })

            emitter.on('UPDATE_FOLDER', ({folder, isMobileDropdown}) => {
                form.value = {}
                form.value = { ...folder };
                open.value = true;
                isUpdate.value = true
                error.value = {}
                isMobileDropdownPopup.value = isMobileDropdown
            })

            emitter.on('ADD_FOLDER_MOBILE', () => {
                mobileOpen.value = true
            })
        })

        return {
            addFolder,
            handleClose,
            isUpdate,
            open,
            handleAddFolderClick,
            form,
            error,
            hasError,
            mobileOpen,
            storing
        }
    }
})
</script>
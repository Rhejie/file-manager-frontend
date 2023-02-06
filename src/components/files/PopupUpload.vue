<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-10">
            <div class="fixed inset-0" />

            <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                    <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                        <TransitionChild as="template"
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enter-from="translate-x-full" enter-to="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leave-from="translate-x-0" leave-to="translate-x-full">
                            <DialogPanel class="pointer-events-auto w-screen max-w-md">
                                <form class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                                    <div class="h-0 flex-1 overflow-y-auto">
                                        <div class="bg-gray-700 py-6 px-4 sm:px-6">
                                            <div class="flex items-center justify-between">
                                                <DialogTitle class="text-lg font-medium text-white">Upload Files
                                                </DialogTitle>
                                                <div class="ml-3 flex h-7 items-center">
                                                    <button type="button"
                                                        class="rounded-md bg-gray-700 text-gray-200 hover:text-white focus:outline-none "
                                                        @click="open = false">
                                                        <span class="sr-only">Close panel</span>
                                                        <XCircleIcon class="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="mt-1">
                                                <p class="text-sm text-gray-100">Any kind of documents.</p>
                                            </div>
                                        </div>
                                        <div class="flex flex-1 flex-col justify-between">
                                            <div class="divide-y divide-gray-200 px-4 sm:px-6">
                                                <div class="space-y-6 pt-6 pb-5">
                                                    <FileUpload :folder_id="folder_id" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-shrink-0 justify-end px-4 py-4">
                                        <!-- <button type="button"
                                            class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                            @click="open = false">Cancel</button> -->
                                        <button type="button" @click="open = false"
                                            class="ml-4 inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                            Close
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
  
<script>
import { defineComponent, onMounted, ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XCircleIcon } from '@heroicons/vue/outline'
import { useEmitter } from '@/composables/useEmitter'
import FileUpload from "@/components/files/FileUpload.vue"
export default defineComponent({
    name: "PopupUpload",
    components: {
        DialogTitle,
        Dialog,
        DialogPanel,
        TransitionChild,
        TransitionRoot,
        XCircleIcon,
        FileUpload
    },
    setup() {
        const emitter = useEmitter;
        const open = ref(false)
        const folder_id = ref(null);

        onMounted(() => {
            emitter.on('FOLDER_ID', data => {
                folder_id.value = data
            })

            emitter.on('UPLOAD_FILE', data => {
                if (folder_id.value && data) {
                    open.value = data
                }
            })
        })
        return {
            open,
            folder_id
        }
    }
})
</script>
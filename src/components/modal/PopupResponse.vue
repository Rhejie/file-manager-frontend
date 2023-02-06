<template>
    <div aria-live="assertive"
        class="mt-14 pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
        <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
            <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
            <transition enter-active-class="transform ease-out duration-300 transition"
                enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
                leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="showSuccess"
                    class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-green-100 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div class="p-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <CheckCircleIcon class="h-6 w-6 text-green-400" aria-hidden="true" />
                            </div>
                            <div class="ml-3 w-0 flex-1 pt-0.5">
                                <p class="text-sm font-medium text-gray-900">{{responseMessage}}</p>
                                <!-- <p class="mt-1 text-sm text-gray-500">Anyone with a link can now view this file.</p> -->
                            </div>
                            <div class="ml-4 flex flex-shrink-0">
                                <button type="button" @click="showSuccess = false"
                                    class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    <span class="sr-only">Close</span>
                                    <XCircleIcon class="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import { CheckCircleIcon } from '@heroicons/vue/outline'
import { XCircleIcon } from '@heroicons/vue/solid'
import { useEmitter } from "@/composables/useEmitter";

export default defineComponent({
    name: "PopupResponse",
    components: {
        CheckCircleIcon,
        XCircleIcon
    },
    setup() {
        const emitter = useEmitter;

        const showSuccess = ref(false)
        const responseMessage = ref('')

        onMounted(() => {
            emitter.on('NOTIFICATION', ({ message, type, mode }) => {
                if (type === 'success') {
                    if (mode === 'update') {
                        responseMessage.value = message
                        showSuccess.value = true
                    }
                    else {
                        responseMessage.value = message
                        showSuccess.value = true
                    }
                }

                setTimeout(() => {
                    showSuccess.value = false;
                }, 3000)
            })
        })

        return {
            showSuccess,
            responseMessage
        }
    }
})
</script>
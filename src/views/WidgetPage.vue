<template>
    <main class="flex-1 overflow-y-auto mb-20 h-screen">
        <nav class="flex border-b border-gray-200 bg-white" aria-label="Breadcrumb">
            <ol role="list" class=" flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8">
                <li class="flex">
                    <div class="flex items-center">
                        <router-link to="/" class="text-gray-400 hover:text-gray-500">
                            <HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                            <span class="sr-only">Home</span>
                        </router-link>
                    </div>
                </li>
                <li class="flex">
                    <div class="flex items-center">
                        <svg class="h-full w-6 flex-shrink-0 text-gray-200" viewBox="0 0 24 44" preserveAspectRatio="none"
                            fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                        </svg>
                        <span class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                            Widget
                        </span>
                    </div>
                </li>
            </ol>
        </nav>
        <div class="max-w-8xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-20">
            <Transition name="slide-fade">
                <SuccessAlert v-if="showSuccessAlert" class="mt-2" @handleClickClose="handleClickClose" :message="alertMessage" />
            </Transition>
            <WidgetFileGridView v-if="!isList" :files="files" :loading="loadingFiles" :next="next"/>
        </div>
    </main>
</template>
<script>
import { fetchWithPaginate } from "@/composables/resource_service";
import { computed, defineComponent, onMounted, provide, ref, watch } from "vue";
import { useStore } from "vuex";
import WidgetFileGridView from "@/components/widget/WidgetFileGridView.vue";
import {
    HomeIcon,
} from '@heroicons/vue/solid'
import { useEmitter } from "@/composables/useEmitter";
import SuccessAlert from "@/components/ui/SuccessAlert.vue";

export default defineComponent({
    name: "WidgetPage",
    props: {
        type: {
            type: String,
            default: ''
        }
    },
    components: {
    WidgetFileGridView,
    HomeIcon,
    SuccessAlert
},
    setup(props) {
        const store = useStore();
        const files = ref([])
        const isList = computed(() => store.state.isList)
        const emitter = useEmitter;
        const fileType = computed(() => props.type)
        const loadingFiles = ref(false)
        const folder_id = ref('');
        const params = ref({
            pageSize: 10,
            page: 1,
            search: ''
        })
        const total = ref(0)
        const previous = ref('');
        const next = ref('')
        const tempFiles = ref([])
        const alertMessage = ref('')
        const showSuccessAlert = ref(false)

        const loadDocsFiles =  async () => {
            loadingFiles.value = true
            let url = ''
            if(fileType.value == 'docs') {
                url = `/user/setting/files/docs`
            }
            else if (fileType.value == 'multimedia') {
                url = '/user/setting/files/multimedia'
            }
            else {
                url = '/user/setting/files/other'
            }

            const { data, load, nextPage} = fetchWithPaginate(params.value, url)
            await load();
            files.value = data.value.data
            loadingFiles.value = false
            next.value = nextPage.value
        }

        const handleClickloadMore = () => {
            if (next.value) {
                params.value.page = params.value.page + 1
            }
        }

        provide('loadMore', {
            next,
            clickNextPage: handleClickloadMore,
        })

        watch(params.value, async () => {
            tempFiles.value = files.value
            await loadDocsFiles()
            files.value.forEach(file => {
                tempFiles.value.push(file)
            })

            files.value = tempFiles.value
            
        })

        onMounted( async () => {
            emitter.on('ADD_FAVORITE_FILE', ({ type, data, favorite }) => {
                console.log(favorite, 'favorite')
                if (type == 'file') {
                    files.value.map(file => {
                        if (data.id == file.id) {
                            for (let key in data) {
                                file[key] = data[key];
                            }
                        }

                        return file;
                    })
                }
                alertMessage.value = 'Successfully add to favorites'
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })

            emitter.on('UPDATED_FILE', data => {
                if (data && data.id) {
                    files.value.map(file => {
                        if (data.id == file.id) {
                            for (let key in data) {
                                file[key] = data[key];
                            }
                        }

                        return files;
                    })
                    alertMessage.value = 'Successfully update file'
                    showSuccessAlert.value = true
                    setTimeout(() => {
                        showSuccessAlert.value = false
                    }, 3000)
                }
            })

            emitter.on('REMOVE_FAVORITE', ({ type, data }) => {
                if (type == 'file') {
                    console.log(data, 'remove')
                    if(data) {
                        let index = files.value.findIndex(file => {
                            if(file.favorite) {
                                return file.favorite.id == data.id
                            }
                        });
                        files.value[index].favorite = null
                    }
                }
                alertMessage.value = 'Successfully remove to favorites'
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })

            emitter.on('MOVED_FILE', () => {
                // let index = files.value.findIndex(file => file.id == data.id);
                // files.value.splice(index, 1);
                alertMessage.value = 'Successfully moved'
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })
            
            emitter.on('DELETED_FILE', data => {
                let _index = files.value.findIndex(folder => folder.id == data.id);
                files.value.splice(_index, 1);
                alertMessage.value = 'Successfully deleted file'
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })
            await loadDocsFiles();
        })

        
        return {
            isList,
            files,
            loadingFiles,
            folder_id,
            total,
            previous,
            next,
            tempFiles,
            showSuccessAlert,
            alertMessage
        }
    }  
})
</script>
<style scoped>
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
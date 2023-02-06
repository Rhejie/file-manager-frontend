<template>
    <div>
        <div v-if="fileType == 'folder'" :class="[length == 0 ? 'pb-60' : '']">
            <div class=" bg-white shadow">
                <ul role="list" class="divide-y divide-gray-200" ref="scrollFolder"
                    v-infinite-scroll="loadMoreToday.clickNextPageWeekFolder" 
                    :infinite-scroll-immediate-check="false"
                    :infinite-scroll-disabled="disableScroll" 
                    infinite-scroll-watch-disabled="disableScroll">
                    <li v-for="(folder, index) in files" :key="folder.id">
                        <div class="block hover:bg-gray-50"
                            :class="[files.length == index+1 ? 'border-b border-gray-200' : '']">
                            <div class="flex items-center px-4 sm:px-6">
                                <div class="flex min-w-0 flex-1 items-center">
                                    <div class="flex-shrink-0">
                                        <FolderIcon class="h-12 w-12 rounded-full text-gray-500" alt="" />
                                    </div>
                                    <div class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                        <div>
                                            <p class="truncate text-sm font-medium text-gray-600">{{ folder.name }}
                                            </p>
                                            <p class="mt-2 flex items-center text-sm text-gray-500">
                                                <UserIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                    aria-hidden="true" />
                                                <span class="truncate">{{ folder.user ? folder.user.name : '' }}</span>
                                            </p>
                                        </div>
                                        <div class="hidden md:block">
                                            <div>
                                                <p class="text-sm text-gray-900">
                                                    Created on
                                                    {{ ' ' }}
                                                    <time :datetime="folder.created_at">{{ folder.created_at }}</time>
                                                </p>
                                                <p class="mt-2 flex items-center text-sm text-gray-500">
                                                    <button v-if="folder.favorite" type="button"
                                                        @click="changeFavoriteStatus(false, folder)"
                                                        class="bg-white rounded-full h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                                        <HeartSolid class="h-6 w-6 text-red-700" aria-hidden="true" />
                                                        <span class="sr-only">Favorite</span>
                                                    </button>
                                                    <button v-else type="button"
                                                        @click="changeFavoriteStatus(true, folder)"
                                                        class="bg-white cursor-pointer rounded-full h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                                        <HeartIcon class="h-6 w-6" aria-hidden="true" />
                                                        <span class="sr-only">Favorite</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <DropdownOption class="mx-auto float-right mr-2 mb-2" :data="folder"
                                        :type="'folder'" />
                                </div>
                            </div>
                        </div>
                    </li>
                    <div v-if="loadingData" class=" shadow p-4 w-full">
                        <div class="animate-pulse flex space-x-4">
                            <div class="rounded-full bg-slate-700 h-10 w-10"></div>
                            <div class="flex-1 space-y-6 py-1">
                                <div class="h-2 bg-slate-700 rounded"></div>
                                <div class="space-y-3">
                                    <div class="grid grid-cols-3 gap-4">
                                        <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                                        <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                                    </div>
                                    <div class="h-2 bg-slate-700 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ul>
            </div>
            <!-- <div class="pt-2" v-if="nextPageFolder">
                <ButtonUi class="w-40 p-2" @handleClick="loadMoreToday.clickNextPageTodayFolder" :label="'load more folders'"/>
            </div> -->
        </div>
        <div v-else :class="[length == 0 ? 'pb-40' : '']">
            <!-- <span class="text-gray-500 text-md" v-if="files.length > 0">Files</span> -->
            <div class=" bg-white shadow">
                <ul role="list" class="divide-y divide-gray-200"
                    v-infinite-scroll="loadMoreToday.clickNextPageWeekFile" :infinite-scroll-immediate-check="false"
                    :infinite-scroll-disabled="disableScroll" infinite-scroll-watch-disabled="disableScroll">
                    <li v-for="folder in files" :key="folder.id">
                        <div class="block hover:bg-gray-50">
                            <div class="flex items-center px-4 sm:px-6">
                                <div class="flex min-w-0 flex-1 items-center">
                                    <div class="flex-shrink-0">
                                        <!-- <FolderIcon v-if="false" class="h-12 w-12 rounded-full text-gray-500" alt="" /> -->
                                        <img v-if="isPicture(folder.mimetype)"
                                            :src="folder.url ? folder.url : folder.url_path" :alt="folder.name"
                                            class="h-12 w-12 " />
                                        <component v-else :is="fileIcon(folder.mimetype)"
                                            class="mx-auto h-12 w-12 flex-shrink-0 text-indigo-300"
                                            aria-hidden="true" />
                                    </div>
                                    <div class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                        <div>
                                            <p class="truncate text-sm font-medium text-gray-600">{{ folder.name }}
                                            </p>
                                            <p class="mt-2 flex items-center text-sm text-gray-500">
                                                <UserIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                    aria-hidden="true" />
                                                <span class="truncate">{{ folder.user ? folder.user.name : '' }}</span>
                                            </p>
                                        </div>
                                        <div class="hidden md:block">
                                            <div>
                                                <p class="text-sm text-gray-900">
                                                    Created on
                                                    {{ ' ' }}
                                                    <time :datetime="folder.created_at">{{ folder.created_at }}</time>
                                                </p>
                                                <p class="mt-2 flex items-center text-sm text-gray-500">
                                                    <button v-if="folder.favorite" type="button"
                                                        @click="changeFavoriteStatus(false, folder)"
                                                        class="bg-white rounded-full h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                                        <HeartSolid class="h-6 w-6 text-red-700" aria-hidden="true" />
                                                        <span class="sr-only">Favorite</span>
                                                    </button>
                                                    <button v-else type="button"
                                                        @click="changeFavoriteStatus(true, folder)"
                                                        class="bg-white cursor-pointer rounded-full h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                                        <HeartIcon class="h-6 w-6" aria-hidden="true" />
                                                        <span class="sr-only">Favorite</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <DropdownOption class="mx-auto float-right mr-2 mb-2" :data="folder"
                                        :type="'folder'" />
                                </div>
                            </div>
                        </div>
                    </li>
                    <div v-if="loadingData" class=" shadow p-4 w-full">
                        <div class="animate-pulse flex space-x-4">
                            <div class="rounded-full bg-slate-700 h-10 w-10"></div>
                            <div class="flex-1 space-y-6 py-1">
                                <div class="h-2 bg-slate-700 rounded"></div>
                                <div class="space-y-3">
                                    <div class="grid grid-cols-3 gap-4">
                                        <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                                        <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                                    </div>
                                    <div class="h-2 bg-slate-700 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { computed, defineComponent, inject, onMounted, ref } from "vue";
import DropdownOption from "@/components/files/DropdownOption.vue";
import { useRouter } from "vue-router";
import { useEmitter } from "@/composables/useEmitter";
import {
    FolderIcon,
    UserIcon,
    HeartIcon as HeartSolid,
    MusicNoteIcon,
    DocumentTextIcon
} from '@heroicons/vue/solid'
import {
    HeartIcon,

} from '@heroicons/vue/outline'
import { destroy, store } from "@/composables/resource_service";

export default defineComponent({
    name: "RecentWeekList",
    components: { DropdownOption, FolderIcon, UserIcon, HeartSolid, HeartIcon },
    props: {
        data: {
            type: Array,
        },
        type: {
            type: String,
            default: "folder"
        },
        filesLength: {
            type: Number,
            default: 0
        },
        next: {
            type: String,
            default: null
        },
        loading: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const router = useRouter();
        const emitter = useEmitter
        const isClickPreview = ref(false)
        const length = computed(() => props.filesLength)
        const fileType = computed(() => props.type);
        const files = computed(() => props.data);
        const nextPageFolder = computed(() => props.next)
        const scrollFolder = ref(null)
        const disableScroll = computed(() => props.nextPageFolder ? true : false)
        const loadingData = computed(() => props.loading)

        const loadMoreToday = inject('loadMoreToday')

        const handleClickFolder = (folder) => {

            emitter.emit('SELECTED_DATA', {
                data: folder,
                type: fileType.value,
            })

            isClickPreview.value = true
            emitter.emit('CLICK_PREVIEW')
        }

        const handleOpenFolderClick = (folder) => {
            if (fileType.value == 'folder') {
                router.push({ name: "Open Folder", params: { id: folder.id } })
            }
        }

        const changeFavoriteStatus = async (status, file) => {
            if (!status) {
                if (file.favorite) {
                    await destroy(`/user/favorites/remove`, file.favorite.id).then(() => {
                        emitter.emit('REMOVE_FAVORITE_TODAY', { type: fileType.value, data: file.favorite })
                        file.favorite = null
                    }).catch(error => {

                        console.log('this error in removing favorite --> ', error)
                    })
                }
            }
            else {
                if (fileType.value == 'folder') {
                    const params = {
                        id: file.id,
                        type: 'folder'
                    }

                    const { data, post } = store('/user/favorites/store', params)
                    await post();
                    emitter.emit('ADD_FAVORITE_FILE_TODAY', { type: 'folder', data: data.value })
                    file.favorite = data.value.favorite
                }
                else {
                    const params = {
                        id: file.id,
                        type: 'file'
                    }
                    const { data, post } = store('/user/favorites/store', params)
                    await post();
                    emitter.emit('ADD_FAVORITE_FILE_TODAY', { type: 'file', data: data.value })
                    file.favorite = data.value.favorite
                }
            }
        }

        const isPicture = (mimetype) => {
            if (mimetype == 'png') {
                return true
            }
            else if (mimetype == 'gif') {
                return true
            }
            else if (mimetype == 'jpg') {
                return true;
            }
            else if (mimetype == 'jpeg') {
                return true;
            }
            else {
                false
            }
        }

        const fileIcon = (mimetype) => {
            if (mimetype == 'mp3') {
                return MusicNoteIcon
            }
            return DocumentTextIcon;
        }


        onMounted(async () => {

        })


        return {
            fileType,
            files,
            handleClickFolder,
            isClickPreview,
            handleOpenFolderClick,
            length,
            changeFavoriteStatus,
            isPicture,
            fileIcon,
            nextPageFolder,
            loadMoreToday,
            scrollFolder,
            disableScroll,
            loadingData
        };
    },
})
</script>
<template>
    <aside class="hidden w-96 h-screen bg-white p-8 border-l border-gray-200 overflow-y-auto lg:block">
        <div class="pb-16 space-y-6 mb-20">
            <div class="flex">
                <!-- <button type="button"
                    class="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Download</button> -->
                <button type="button"
                    @click="handleCloseSidePreview"
                    class="flex-1 ml-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Close</button>
            </div>
            <div>
                <div class="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
                    <FolderIcon v-if="type === 'folder'" class="object-cover text-gray-300" />
                    <img :src="selected.url" alt="" class="object-cover"
                        v-else-if="type !== 'folder' && isPicture(selected)" />
                    <component v-else :is="fileIcon(file)" class="mx-auto h-full w-full flex-shrink-0 text-indigo-300"
                        aria-hidden="true" />
                </div>
                <div class="mt-4 flex items-start justify-between">
                    <div>
                        <h2 class="text-lg font-medium text-gray-900"><span class="sr-only">Details for </span>{{
                        selected.name
                        }}</h2>
                        <p class="text-sm font-medium text-gray-500" v-if="type !== 'folder'">{{ convertFileSizeToMB(selected.filesize) }}
                        </p>
                    </div> 
                    <button v-if="selected.favorite" type="button" @click="changeFavoriteStatus(false)"
                        class="ml-4 bg-white rounded-full h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        <HeartSolid  class="h-6 w-6 text-red-700" aria-hidden="true" />
                        <span class="sr-only">Favorite</span>
                    </button>
                    <button v-else type="button" @click="changeFavoriteStatus(true)"
                        class="ml-4 bg-white rounded-full h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        <HeartIcon  class="h-6 w-6" aria-hidden="true"  />
                        <span class="sr-only">Favorite</span>
                    </button>
                </div>
            </div>
            <div>
                <h3 class="font-medium text-gray-900">Information</h3>
                <dl class="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                    <div class="py-3 flex justify-between text-sm font-medium">
                        <dt class="text-gray-500">Owner</dt>
                        <dd class="text-gray-900">{{getOwner(selected)}}</dd>
                    </div>
                    <div class="py-3 flex justify-between text-sm font-medium">
                        <dt class="text-gray-500">Created</dt>
                        <dd class="text-gray-900">{{selected.created_at}}</dd>
                    </div>
                    <div class="py-3 flex justify-between text-sm font-medium">
                        <dt class="text-gray-500">Last Modified</dt>
                        <dd class="text-gray-900">{{selected.updated_at}}</dd>
                    </div>
                </dl>
            </div>
            <!-- <div>
                <h3 class="font-medium text-gray-900">Description</h3>
                <div class="mt-2 flex items-center justify-between">
                    <p class="text-sm text-gray-500 italic">Add a description to this image.</p>
                    <button type="button"
                        class="bg-white rounded-full h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <PencilIcon class="h-5 w-5" aria-hidden="true" />
                        <span class="sr-only">Add description</span>
                    </button>
                </div>
            </div> -->
            <div>
                <h3 class="font-medium text-gray-900">Assigned To</h3>
                <ul v-loading="loadingAssignedUsers" role="list" class="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                    <li v-for="(person, index) in assignedUsers" :key="person.id"
                        class="py-3 flex justify-between items-center">
                        <div class="flex items-center">
                            <p class="ml-4 text-sm font-medium text-gray-900">{{ person.useable.name }}</p>
                        </div>
                        <button type="button"
                            class="ml-6 bg-white rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <TrashIcon v-if="statusAssigned" @click="handleRemoveUserAssigned(person, index)" class="w-5 text-gray-700" />
                        </button>
                    </li>
                    <li class="py-2 flex justify-between items-center" v-if="statusAssigned">
                        <button type="button"
                            @click="handleClickAssignedUsers"
                            class="group -ml-1 bg-white p-1 rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <span
                                class="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                <PlusSmIconSolid  class="h-5 w-5" aria-hidden="true" />
                            </span>
                            <span
                                class="ml-4 text-sm font-medium text-indigo-600 group-hover:text-indigo-500">Assigned</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </aside>
</template>
<script>
import { computed, defineComponent, onMounted, ref, watch } from "vue";

import {
    HeartIcon,

} from '@heroicons/vue/outline'
import {TrashIcon, HeartIcon as HeartSolid} from '@heroicons/vue/solid'
import {
    PencilIcon,
    FolderIcon,
    PlusSmIcon as PlusSmIconSolid,
    DocumentTextIcon,
} from '@heroicons/vue/solid'
import { destroy, fetchById, store } from "@/composables/resource_service";
import { useEmitter } from "@/composables/useEmitter";
import { useRouter } from "vue-router";
export default defineComponent({
    name: "SidePreviewFile",
    components: {
        HeartIcon,
        PencilIcon,
        PlusSmIconSolid,
        FolderIcon,
        TrashIcon,
        HeartSolid
    },
    props: {
        fileType: {
            type: String,
            default: ""
        },
        selectedData: {
            type: Object
        },
        assignedStatus: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const router = useRouter();
        const emitter = useEmitter;
        const selected = computed(() => props.selectedData)
        const type = computed(() => props.fileType)
        const loadingAssignedUsers = ref(false);
        const assignedUsers = ref([]);
        const statusAssigned = computed(() => props.assignedStatus)
        

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

        const fileIcon = () => {
            return DocumentTextIcon;
        }

        const getOwner = (selected) => {
            return selected.user ? selected.user.name : 'N/A';
        }

        const loadAssignedUsersForFolder = async () => {
            loadingAssignedUsers.value = true
            const {load, data} = fetchById(`/user/assigned/assigned-users-folder/${selected.value.id}`, type.value);
            await load();
            assignedUsers.value = data.value;
            loadingAssignedUsers.value = false
        }

        const handleClickAssignedUsers = () => {
            emitter.emit('ASSIGNED_USER', {
                data: selected.value,
                type: type.value
            })
        }

        const handleCloseSidePreview = () => {
            emitter.emit('CLOSE_SIDE_PREVIEW')
        }

        const changeFavoriteStatus = async (status) => {
            if(!status) {
                if(selected.value.favorite) {
                    await destroy(`/user/favorites/remove`, selected.value.favorite.id).then(() => {
                        if (router.currentRoute.value.name == 'All Files' ||
                            router.currentRoute.value.name == 'Widget Page' ||
                            router.currentRoute.value.name == 'Open Folder') {
                            emitter.emit('REMOVE_FAVORITE', { type: type.value, data: selected.value.favorite })
                        }
                        else {
                            emitter.emit('REMOVE_FAVORITE_IN_FAVORITES', { type: type.value, data: selected.value.favorite })
                        }
                        // emitter.emit('REMOVE_FAVORITE', {type: type.value, data: selected.value.favorite})
                        selected.value.favorite = null
                    }).catch(error => {
                        
                        console.log('this error in removing favorite --> ', error)
                    })
                }
            }
            else {
                if(type.value == 'folder') {
                    const params = {
                        id: selected.value.id,
                        type: 'folder'
                    }

                    const { data, post } = store('/user/favorites/store', params)
                    await post();
                    emitter.emit('ADD_FAVORITE_FILE', { type: 'folder', data: data.value })
                    selected.value.favorite = data.value.favorite
                }
                else {
                    const params = {
                        id: selected.value.id,
                        type: 'file'
                    }
                    const { data, post } = store('/user/favorites/store', params)
                    await post();
                    emitter.emit('ADD_FAVORITE_FILE', { type: 'file', data: data.value })
                    selected.value.favorite = data.value.favorite
                }
            }
        }
        const handleRemoveUserAssigned = async (user, index) => {
            await destroy('/user/assigned/remove-user', user.id)
            assignedUsers.value.splice(index, 1)
            emitter.emit('NOTIFICATION', {
                message: 'Successfully remove assigned user',
                type: "success",
                mode:  'store'
            })
        }

        const convertFileSizeToMB = (size) => {
            return (size / (1024 ** 2)).toFixed(2) + 'mb'
        }

        onMounted(async () => {
            if(type.value === 'folder') {
                await loadAssignedUsersForFolder()
            }
            else {
                await loadAssignedUsersForFolder()
            }

            emitter.on('NEW_ASSIGNED_USERS', data => {
                data.forEach(user => {
                    assignedUsers.value.unshift(user);
                })
            })

            emitter.on('DELETED_USERS', data => {
                data.forEach(user => {
                    const index = assignedUsers.value.findIndex(a => a.id === user.id);
                    assignedUsers.value.splice(index, 1)
                })
            })
        })

        watch(selected, async() => {
            await loadAssignedUsersForFolder();
        })


        return {
            type: computed(() => props.fileType),
            selected,
            isPicture,
            fileIcon,
            assignedUsers,
            loadingAssignedUsers,
            changeFavoriteStatus,
            handleClickAssignedUsers,
            handleRemoveUserAssigned,
            statusAssigned,
            getOwner,
            handleCloseSidePreview,
            convertFileSizeToMB
        }
    }
})
</script>
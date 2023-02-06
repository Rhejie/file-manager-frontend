<template>
    <div class="hidden sm:block w-full">
        <el-dropdown trigger="click" :class="'float-right'">
            <span class="el-dropdown-link">
                <DotsHorizontalIcon v-if="fileType == 'file'" class="h-5 w-5 mr-2" aria-hidden="true" />
                <DotsVerticalIcon v-else class="h-5 w-5" aria-hidden="true" />
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-if="fileType == 'folder'" :class="['hover:bg-gray-200']" @click="handleOpenFolderClick(file)">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <FolderOpenIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true"
                                 />
                            Open
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!isFromAssignedPage" @click="handleEditFolderClick(file, false)" :disabled="userPermission == 'read' ? true : false">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <PencilAltIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true" />
                            Rename
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!isFromAssignedPage && file.allow_move" @click="handleClickMoveFile(file, false)">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <ArrowRightIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true" />
                            Move
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!isFromAssignedPage">
                        <div  @click="handleClickAssigned(file, false)" class="group w-full flex items-center px-4 py-2 text-sm">
                            <UserAddIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Assign
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!isFromAssignedPage && fileType != 'folder'">
                        <div  @click="handleClickShared(file, false)" class="group w-full flex items-center px-4 py-2 text-sm">
                            <UserAddIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Share to unit
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleAddFavoriteClick(file)">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <HeartIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            {{file.favorite ? 'Remove to favorites' : 'Add to favorites'}}
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleClickDownload(file)" v-if="fileType != 'folder'">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <CloudDownloadIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Download
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!isFromAssignedPage && checkifParentFolder(file) && checkIfOwnFile(file)" @click="handleClickTrash(file)">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <TrashIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Trash
                        </div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>

    <!-- Mobile dropdown -->
    <div class="sm:hidden w-full" :class="'float-right'">
        <el-dropdown trigger="click" :class="['float-right']">
            <span class="el-dropdown-link">
                <span class="p-2 ">More</span>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-if="fileType == 'folder'" :class="['hover:bg-gray-200']" @click="handleOpenFolderClick(file)">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <FolderOpenIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true"
                                 />
                            Open
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!isFromAssignedPage" @click="handleEditFolderClick(file, true)"
                        :disabled="userPermission == 'read' ? true : false">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <PencilAltIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Rename
                        </div>  
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!isFromAssignedPage && file.allow_move" @click="handleClickMoveFile(file, true)">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <ArrowRightIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Move
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!isFromAssignedPage">
                        <div @click="handleClickAssigned(file, true)" class="group w-full flex items-center px-4 py-2 text-sm">
                            <UserAddIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Assign
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!isFromAssignedPage && fileType != 'folder'">
                        <div  @click="handleClickShared(file, true)" class="group w-full flex items-center px-4 py-2 text-sm">
                            <UserAddIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Share to unit
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleAddFavoriteClick(file)">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <HeartIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            {{file.favorite ? 'Remove to favorites' : 'Add to favorites'}}
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleClickDownload(file)" v-if="fileType != 'folder'">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <CloudDownloadIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true" />
                            Download
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item  v-if="!isFromAssignedPage && checkifParentFolder(file)" @click="handleClickTrash(file)">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <TrashIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Trash
                        </div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
<script>
import { computed, defineComponent, inject } from "vue";
// import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
    ArrowRightIcon,
    // ChevronDownIcon,
    HeartIcon,
    PencilAltIcon,
    TrashIcon,
    UserAddIcon,
    DotsVerticalIcon,
    DotsHorizontalIcon,
    FolderOpenIcon,
    // EyeIcon,
    CloudDownloadIcon
} from '@heroicons/vue/solid'
import { useEmitter } from "@/composables/useEmitter";
import { useRouter } from "vue-router";
import { destroy, store } from "@/composables/resource_service";

export default defineComponent({
    name: "DropdownOptions",
    components: {
        // Menu, MenuButton, MenuItem, MenuItems,
        ArrowRightIcon,
        // ChevronDownIcon,
        HeartIcon,
        PencilAltIcon,
        TrashIcon,
        UserAddIcon,
        DotsVerticalIcon,
        FolderOpenIcon,
        // EyeIcon,
        CloudDownloadIcon,
        DotsHorizontalIcon
    },
    props: {
        data: {
            type: Object
        },
        type: {
            type: String,
            default: "folder"
        },
        permission: {
            type: String,
            default: "read_write"
        },
        fromAssignedPage: {
            type: Boolean,
            default: false
        },
        isFromMainPage: {
            type: Boolean,
            default: false,
        }
    },
    setup(props) {
        const emitter = useEmitter;
        const auth = inject('auth');
        const router = useRouter();
        const user = computed(() => JSON.parse(auth.remember()));
        const fileType = computed(() => props.type)
        const userPermission = computed(() => props.permission)
        const isFromAssignedPage = computed(() => props.fromAssignedPage)
        const isFromMainPageData = computed(() => props.isFromMainPage)

        const handleEditFolderClick = (folder, isMobileDropdown) => {
            if(fileType.value == 'folder') {
                emitter.emit('UPDATE_FOLDER', {
                    folder,
                    isMobileDropdown
                });
            }
            else {
                emitter.emit('UPDATE_FILE', {
                    folder,
                    isMobileDropdown
                });
            }
        }

        const handleOpenFolderClick = (file) => {
            console.log(file.id)
            if(fileType.value == 'folder') {
                if(isFromAssignedPage.value) {
                    router.push({ name: "Assigned Folder", params: { id: file.id } })
                }
                else {
                    router.push({ name: "Open Folder", params: { id: file.id } })
                }
                
                return 
            }
            else {
                let url = file.url ? file.url : file.url_path
                window.location.assign(url)
            }
        }

        const handleAddFavoriteClick = async (file) => {
            if(file.favorite ) {
                await destroy(`/user/favorites/remove`, file.favorite.id).then(() => {
                    if (router.currentRoute.value.name == 'All Files' || 
                        router.currentRoute.value.name == 'Widget Page' || 
                        router.currentRoute.value.name == 'Open Folder') {
                        emitter.emit('REMOVE_FAVORITE', { type: fileType.value, data: file.favorite })
                    }
                    else {
                        emitter.emit('REMOVE_FAVORITE_IN_FAVORITES', { type: fileType.value, data: file.favorite })
                    }
                    console.log(file.favorite, 'favorite')
                }).catch(error => {
                    console.log('this error in removing favorite --> ', error)
                })

                return ;
            }

            else if(fileType.value == 'folder') {
                const params = {
                    id: file.id,
                    type: 'folder'
                }

                const {data, post} = store('/user/favorites/store', params)
                await post();
                emitter.emit('ADD_FAVORITE_FILE', { type: 'folder', data: data.value.data, favorite: data.value.favorite })
                return 
            }
            else {
                const params = {
                    id: file.id,
                    type: 'file'
                }
                const { data, post } = store('/user/favorites/store', params)
                await post();
                emitter.emit('ADD_FAVORITE_FILE', { type: 'file', data: data.value.data, favorite: data.value.favorite })
                return 
            }
        }

        const handleClickMoveFile = (file, isMobile) => {
            emitter.emit('MOVE_FILE', {
                file,
                file_type: fileType.value,
                isMobile,
            })
        }
        
        const handleClickDownload = async (file) => {
            let url = file.url ? file.url : file.url_path
            window.location.assign(url)
            // window.open(url)
            // await download('/file-manager/file/download', file.id).then(res => {
            //     const url = window.URL.createObjectURL(new Blob([res.data]));
            //     const link = document.createElement('a');
            //     link.href = url;
            //     link.setAttribute('download', `${file.last_name}.${file.mimetype}`);
            //     document.body.appendChild(link);
            //     link.click();
            // }).catch(error => {
            //     console.log('Error ing downloading --> ', error)
            // })
        }
        const handleClickTrash = async (file) => {
            emitter.emit('DELETE_FILE', { file, fileType: fileType.value})
            // await destroy('/file-manager/folder/delete', file.id)
        }

        const handleClickAssigned = (folder, isFromMobile) => {
            
            if(fileType.value === 'folder') {
                emitter.emit('ASSIGNED_USER', {
                    data: folder,
                    type: "folder",
                    isFromMobile
                })
                return
            }
            emitter.emit('ASSIGNED_USER', {
                data: folder,
                type: "file",
                isFromMobile
            })
        }

        const handleClickShared = (file, isFromMobile) => {
            if (fileType.value === 'folder') {
                emitter.emit('SHARED_UNIT', {
                    data: file,
                    type: "folder",
                    isFromMobile
                })
                return
            }
            emitter.emit('SHARED_UNIT', {
                data: file,
                type: "file",
                isFromMobile
            })
        }

        const checkifParentFolder = (file) => {
            if(fileType.value === 'folder') {
                if(file.allow_move) {
                    return true
                }
                return false
            }
            else {
                return true
            }
        }

        const checkIfOwnFile = (file) => {
            if(file.user_id == user.value.id) {
                return true
            }

            return false
        }

        return {
            file: computed(() => {
                return props.data
            }),
            handleEditFolderClick,
            handleOpenFolderClick,
            handleClickAssigned,
            fileType,
            userPermission,
            isFromAssignedPage,
            handleAddFavoriteClick,
            handleClickDownload,
            handleClickTrash,
            user,
            handleClickMoveFile,
            isFromMainPageData,
            checkifParentFolder,
            checkIfOwnFile,
            handleClickShared
        }
    }
})
</script>
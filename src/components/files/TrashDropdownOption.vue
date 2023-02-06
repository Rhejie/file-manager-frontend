<template>
    <div class="hidden sm:block w-full">
        <el-dropdown trigger="click" :class="'float-right'">
            <span class="el-dropdown-link">
                <!-- <span class="p-2 mb-2" v-if="fileType == 'file'">More</span> -->
                <DotsHorizontalIcon class="h-5 w-5" aria-hidden="true" />
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <!-- <el-dropdown-item @click="handleClickDownload(file)" v-if="fileType != 'folder'">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <CloudDownloadIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Delete
                        </div>
                    </el-dropdown-item> -->
                    <el-dropdown-item @click="handleClickArchive(file)">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <ArchiveIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Restore
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleClickTrash(file)">
                        <div class="group w-full flex items-center px-4 py-2 text-sm">
                            <TrashIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Delete
                        </div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
<script>
import { computed, defineComponent } from "vue";
// import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
    // ArrowRightIcon,
    // ChevronDownIcon,
    // HeartIcon,
    // PencilAltIcon,
    TrashIcon,
    // UserAddIcon,
    DotsHorizontalIcon,
    // FolderOpenIcon,
    // EyeIcon,
    // CloudDownloadIcon
    ArchiveIcon
} from '@heroicons/vue/solid'
import { useEmitter } from "@/composables/useEmitter";
import { useRouter } from "vue-router";
import { download, destroy } from "@/composables/resource_service";

export default defineComponent({
    name: "TrashDropdownOptions",
    components: {
        ArchiveIcon,
        // Menu, MenuButton, MenuItem, MenuItems,
        // ArrowRightIcon,
        // ChevronDownIcon,
        // HeartIcon,
        // PencilAltIcon,
        TrashIcon,
        // UserAddIcon,
        DotsHorizontalIcon,
        // FolderOpenIcon,
        // EyeIcon,
        // CloudDownloadIcon
    },
    props: {
        data: {
            type: Object
        },
        type: {
            type: String,
            default: ""
        },
        permission: {
            type: String,
            default: "read_write"
        },
        fromAssignedPage: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const emitter = useEmitter;
        const router = useRouter();
        const fileType = computed(() => props.type)
        const userPermission = computed(() => props.permission)
        const isFromAssignedPage = computed(() => props.fromAssignedPage)

        const handleClickArchive = async (file) => {
            if (fileType.value == 'folder') {
                await destroy('/file-manager/folder/archive', file.id)
                emitter.emit('RESTORED_FOLDER', file)
            }
            else {
                await destroy('/file-manager/file/restore', file.id)
                emitter.emit('RESTORED_FILE', file)
            }
        }

        const handleClickTrash = async (file) => {
            
            emitter.emit('PERMANENT_DELETE_FILE', { file, fileType: fileType.value })
            // await destroy('/file-manager/folder/destroy', file.id)
        }

        const handleEditFolderClick = (folder) => {
            emitter.emit('UPDATE_FOLDER', folder);
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
        }
        
        const handleClickDownload = async (file) => {
            await download('/file-manager/file/download', file.id).then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${file.last_name}.${file.mimetype}`);
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                console.log('Error ing downloading --> ', error)
            })
        }

        const handleClickAssigned = (folder) => {
            if(fileType.value === 'folder') {
                emitter.emit('ASSIGNED_USER', {
                    data: folder,
                    type: "folder"
                })
                return
            }
            emitter.emit('ASSIGNED_USER', {
                data: folder,
                type: "file"
            })
        }

        return {
            file: computed(() => props.data),
            handleEditFolderClick,
            handleOpenFolderClick,
            handleClickAssigned,
            handleClickTrash,
            handleClickArchive,
            fileType,
            userPermission,
            isFromAssignedPage,
            handleClickDownload
        }
    }
})
</script>
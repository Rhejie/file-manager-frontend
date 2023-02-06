<template>
  <!-- Main content -->
  <main class="flex-1 overflow-y-auto mb-20 h-screen">
    <div class="pt-4 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div class="">
        <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="category in categories" :key="category.name" @click="handleSelectCategory(category)" class="col-span-1 cursor-pointer  shadow-md flex shadow-sm rounded-md">
            <div
              :class="[category.bgColor, 'flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md']">
              <component :is="category.icon" class="w-8" />
            </div>
            <div
              class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
              <div class="flex-1 px-4 py-2 text-sm truncate">
                <span class="text-gray-900 font-medium hover:text-gray-600">{{ category.name }}</span>
                <p class="text-gray-500">{{ category.count }} Files</p>
              </div>
              <div class="flex-shrink-0 pr-2"> 
                <button type="button"
                  class="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span class="sr-only">Open options</span>
                  <DotsVerticalIcon class="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- mobile -->
      <div class="flex">
        <div class="mt-2 bg-white p-0.5 w-full rounded-lg flex items-center sm:hidden">
          <button type="button" @click="handleListType(true)"
            :class="isGridView ? '' : 'bg-gray-600 text-white shadow-md'"
            class="p-1.5 rounded-md mx-auto flex text-gray-400  hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
            <ViewListIcon class="h-5 w-5" aria-hidden="true" />
            <span class="">List</span>
          </button>
          <button type="button"  @click="handleListType(false)"
            :class="isGridView ? 'bg-gray-600 text-white shadow-md' : ''"
            class="ml-0.5 p-1.5 flex mx-auto rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
            <ViewGridIconSolid class="h-5 w-5" aria-hidden="true" />
            <span class="">Grid</span>
          </button>
        </div>
      </div>
      <!-- end mobile -->

      <!-- Tabs -->
      <div class="mt-3 sm:mt-2">
        
        <div class="hidden sm:block">
          <div class="flex items-center border-b border-gray-200">
            <nav class="flex-1 -mb-px flex space-x-6 xl:space-x-8" aria-label="Tabs">
              <span v-for="tab in tabs" :key="tab.name" :href="tab.href" :aria-current="tab.current ? 'page' : undefined" @click="handleChangeTab(tab)"
                :class="[tab.current ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
                {{ tab.name }}
              </span>
            </nav>
            <!-- <div class="hidden ml-6 bg-gray-100 p-0.5 rounded-lg items-center sm:flex">
              <button type="button" @click="handleListType('list')"
                :class="isGridView ? '' : 'bg-gray-600 text-white shadow-md'"
                class="p-1.5 rounded-md text-gray-400 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                <ViewListIcon class="h-5 w-5" aria-hidden="true" />
                <span class="sr-only">Use list view</span>
              </button>
              <button type="button" @click="handleListType('grid')"
                :class="isGridView ? 'bg-gray-600 text-white shadow-md' : ''"
                class="ml-0.5 p-1.5 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                <ViewGridIconSolid class="h-5 w-5" aria-hidden="true" />
                <span class="sr-only">Use grid view</span>
              </button>
            </div> -->
          </div>
        </div>
      </div>
      <div v-if="selectedTab.name == 'Files'">
        <Transition name="slide-fade">
          <SuccessAlert v-if="showSuccessAlert" class="mt-2" @handleClickClose="handleClickClose" :message="alertMessage" />
        </Transition>
        <GridView v-if="!isList" :folders="folders" :loading="loading" :next="nextFolder" />
        <ListView v-else :folders="folders" :loading="loading" :fileLenght="files.length" :next="nextFolder" />
        <FileGridView v-if="!isList" :files="files" :loading="loadingFiles" />
        <FileListView v-else-if="isList " :files="files" :loading="loadingFiles" :fromMainPage="true" />
      </div>
      <div v-else-if="selectedTab.name == 'Favorites'">
          <FavoritesMainPage/>
      </div>
      <div v-else>
        <RecentMainPage/>
      </div>
    </div>
  </main>
</template>

<script>
import { computed, defineComponent, inject, onMounted, provide, ref, watch } from 'vue'
import {
  MenuAlt2Icon,
  ClipboardIcon,
  ShareIcon,
  ViewGridIcon as ViewGridIconOutline,
  XIcon,
  DocumentIcon,
  VideoCameraIcon
} from '@heroicons/vue/outline'
import {
  SearchIcon,
  ViewGridIcon as ViewGridIconSolid,
  ViewListIcon,
} from '@heroicons/vue/solid'
import SidebarComponent from "@/components/layout/SidebarLayout.vue"
import HeaderComponent from "@/components/layout/HeaderLayout.vue"
import { setActiveNavBar, setListActive } from '@/composables/SetActiveNav'
import GridView from "@/components/files/GridView.vue"
import ListView from '@/components/files/ListView.vue'
import { useStore } from 'vuex'
import { fetchWithPaginate, query } from '@/composables/resource_service'
import { useEmitter } from '@/composables/useEmitter'
import FileGridView from '@/components/files/FileGridView.vue'
import FileListView from '@/components/files/FileListView.vue'
import { useRouter } from 'vue-router'
import SuccessAlert from '@/components/ui/SuccessAlert.vue'
import FavoritesMainPage from '@/components/files/FavoritesMainPage.vue'
import RecentMainPage from '../components/files/RecentMainPage.vue'
import { setTitle } from '@/composables/title_service'
export default defineComponent({
  name: 'FilesPage',
  components: {
    SearchIcon,
    ViewGridIconSolid,
    ViewListIcon,
    ViewGridIconOutline,
    XIcon,
    MenuAlt2Icon,
    DocumentIcon,
    ClipboardIcon,
    VideoCameraIcon,
    SidebarComponent,
    HeaderComponent,
    GridView,
    ListView,
    FileGridView,
    FileListView,
    SuccessAlert,
    FavoritesMainPage,
    RecentMainPage
},
  setup() {

    const store = useStore();
    const emitter = useEmitter;
    const router = useRouter()

    const params = ref({
      pageSize: 50,
      page: 1,
      search: ''
    })

    const paramsFiles = ref({
      pageSize: 50,
      page: 1,
      search: ''
    })

    const nextPageFile = ref(null)
    const tempFiles = ref([])
    
    const nextFolder = ref()
    const showSuccessAlert = ref(false)
    const alertMessage = ref(null)
    

    const auth = inject('auth');

    if (auth.token()) {
      localStorage.setItem('file_manager_access_token', auth.token());
    }

    const tabs = ref([
      { name: 'Files', href: '#', current: true },
      { name: 'Recent', href: '#', current: false },
      { name: 'Favorites', href: '#', current: false },
    ])

    const folders = ref([]);

    const folder_id = ref(null);

    const isUpload = ref(false)

    const docsCountData = ref(0);
    const photosCountData = ref(0);
    const videosCountData = ref(0);
    const assignedCountData = ref(0);


    const mobileMenuOpen = ref(false)

    const categories = ref([
      { name: 'Docs', initials: 'GA', icon: DocumentIcon, href: '#', count: docsCountData.value, bgColor: 'bg-pink-600' },
      { name: 'Multimedia', initials: 'T', icon: VideoCameraIcon, href: '#', count: videosCountData.value, bgColor: 'bg-yellow-500' },
      { name: 'Assigned', initials: 'T', icon: ShareIcon, href: '#', count: assignedCountData.value, bgColor: 'bg-green-500' },
      { name: 'Others', initials: 'CD', href: '#', icon: ClipboardIcon, count: photosCountData.value, bgColor: 'bg-purple-600' },
    ])

    const isGridView = ref(true)

    const tempFolders = ref([])

    const handleListType = (value) => {
      if (value) {
        isGridView.value = false
      }
      else {
        isGridView.value = true
      }
      setListActive(value);
    }

    const isList = computed(() => store.state.isList)
    const loading = ref(false);
    const loadingFiles = ref(false);
    const files = ref([])
    
    const handleClickloadMore = () => {
      if (nextFolder.value) {
        params.value.page = params.value.page + 1
      }
    }

    const handleClickLoadMoreFIle = () => {
      if(nextPageFile.value ) {
        paramsFiles.value.page = paramsFiles.value.page + 1
      }
    }

    provide('loadMore', {
      clickNextPage: handleClickloadMore,
      clickNextPageFile: handleClickLoadMoreFIle,
    })

    const fetchFolders = async () => {
      loading.value = true
      
      const { load, data, nextPage } = fetchWithPaginate(params.value, '/file-manager/folder/list');
      await load();

      folders.value = data.value.folders.data
      loading.value = false
      folder_id.value = data.value.folder_id
      emitter.emit('FOLDER_ID', data.value.folder_id)
      store.commit('setMainDisplayId', data.value.folder_id)
      nextFolder.value = nextPage.value

      if (folder_id.value) {
        if(!nextFolder.value) {
          await loadFiles();
        }
      }
      if(!nextFolder.value && !folder_id.value) {
        await loadAdminFiles();
      }
    }

    const loadFiles = async () => {
      loadingFiles.value = true
      
      const { load, data, nextPage } = fetchWithPaginate(paramsFiles.value, `/file-manager/file/files/${folder_id.value}`)
      await load();
      files.value = data.value.data;
      loadingFiles.value = false;
      nextPageFile.value = nextPage.value
    }

    const loadAdminFiles = async () => {
      loadingFiles.value = true

      const { load, data, nextPage } = fetchWithPaginate(paramsFiles.value, `/file-manager/file/admin/files`)
      await load();
      files.value = data.value.data;
      loadingFiles.value = false;
      nextPageFile.value = nextPage.value
    }

    const docsCount = async () => {
      const { data, load } = query('/file-manager/file/docs-count');
      await load();
      docsCountData.value = data.value
    }

    const photosCount = async () => {
      const { data, load } = query('/file-manager/file/photos-count');
      await load();
      photosCountData.value = data.value
    }

    const videosCount = async () => {
      const { data, load } = query('/file-manager/file/videos-count');
      await load();
      videosCountData.value = data.value
    }

    const assignedCount = async () => {
      const { data, load } = query('/user/assigned/assigned-count');
      await load();
      assignedCountData.value = data.value
    }

    const handleSelectCategory = (category) => {
      if(category.name == 'Docs') {
        router.push({ name: "Widget Page" , params: {type: 'docs'} })
      }
      else if(category.name == 'Multimedia') { 
        router.push({ name: "Widget Page", params: { type: 'multimedia' } })
      }
      else if (category.name == 'Others') {
        router.push({ name: "Widget Page", params: { type: 'other' } })
      }
      else {
        router.push({ name: "Assigned Files"})
      }
    }

    const handleClickClose = () => {
      showSuccessAlert.value = false
    }

    const handleChangeTab = (tab) => {
      tabs.value.map(t => {
        if(t.name == tab.name) {
          t.current = true
        } else {
          t.current = false
        }

        return t
      })
    }

    const selectedTab = computed(() => tabs.value.find(tab => tab.current == true))

    watch(params.value, async () => {
      tempFolders.value = folders.value
      await fetchFolders()
      folders.value.forEach(file => {
        tempFolders.value.push(file)
      })

      folders.value = tempFolders.value

    })

    watch(paramsFiles.value, async () => {
      tempFiles.value = files.value
      await loadFiles()
      files.value.forEach(file => {
        tempFiles.value.push(file)
      })

      files.value = tempFiles.value

    })

    onMounted(async () => {

      setActiveNavBar('All Files');

      setTitle('Files')

      await docsCount();
      await photosCount();
      await videosCount();
      await assignedCount();

      categories.value = [
        { name: 'Docs', initials: 'GA', icon: DocumentIcon, href: '#', count: docsCountData.value, bgColor: 'bg-pink-600' },
        { name: 'Multimedia', initials: 'T', icon: VideoCameraIcon, href: '#', count: videosCountData.value, bgColor: 'bg-yellow-500' },
        { name: 'Assigned', initials: 'T', icon: ShareIcon, href: '#', count: assignedCountData.value, bgColor: 'bg-green-500' },
        { name: 'Others', initials: 'CD', href: '#', icon: ClipboardIcon, count: photosCountData.value, bgColor: 'bg-purple-600' },
      ]

      await fetchFolders();

      // if (folder_id.value) {
      //   await loadFiles();
      // }

      emitter.on('NEW_FILE', data => {
        files.value.unshift(data);
      })

      emitter.on('NEW_FOLDER', data => {
        folders.value.unshift(data);
        alertMessage.value = 'Successfully create a folder'
        showSuccessAlert.value = true
        setTimeout(() => {
          showSuccessAlert.value = false
        }, 3000)
      })

      emitter.on('UPDATED_FOLDER', (data) => {
        if (data && data.id) {
          folders.value.map(folder => {
            if (data.id == folder.id) {
              for (let key in data) {
                folder[key] = data[key];
              }
            }

            return folder;
          })
        }
      })

      emitter.on("SHARED_FILE", () => {
        alertMessage.value = 'Successfully shared to a unit'
        showSuccessAlert.value = true
        setTimeout(() => {
          showSuccessAlert.value = false
        }, 3000)
      })

      emitter.on('UNDO_FILE', data => {
        const index = files.value.findIndex(file => file.id = data.file_id)
        files.value.splice(index, 1);
      })

      emitter.on('MOVED_FILE', data => {
        let index = files.value.findIndex(file => file.id == data.id);
        files.value.splice(index, 1);
        alertMessage.value = 'Successfully moved'
        showSuccessAlert.value = true
        setTimeout(() => {
          showSuccessAlert.value = false
        }, 3000)
      })

      emitter.on('MOVED_FOLDER', data => {
        let index = folders.value.findIndex(folder => folder.id == data.id);
        folders.value.splice(index, 1);
        alertMessage.value = 'Successfully moved'
        showSuccessAlert.value = true
        setTimeout(() => {
          showSuccessAlert.value = false
        }, 3000)
      });

      emitter.on('UPLOAD_FILE', data => {
        isUpload.value = data
      })

      emitter.on('DELETED_FOLDER', data => {
        let _index = folders.value.findIndex(folder => folder.id == data.id);
        folders.value.splice(_index, 1);
        alertMessage.value = 'Successfully deleted folder'
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

      emitter.on('ADD_FAVORITE_FILE', ({type, data, favorite}) => {
        console.log('favorit', favorite)
        if(type == 'folder') {
          folders.value.map(folder => {
            if (data.id == folder.id) {
              for (let key in data) {
                folder[key] = data[key];
              }
            }
            return folder;
          })
        }
        else {
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

      emitter.on('REMOVE_FAVORITE', ({ type, data }) => {
        if(type == 'folder') {
          console.log('data', data)
          let index = folders.value.findIndex(folder => {
            if(folder.favorite) {
              return folder.favorite.id == data.id
            }
          });
          folders.value[index].favorite = null
        }
        else if(type == 'file') {
          let index = files.value.findIndex(folder => {
            if (folder.favorite) {
              return folder.favorite.id == data.id
            }
          });
          files.value[index].favorite = null
        }
        alertMessage.value = 'Successfully remove to favorites'
        showSuccessAlert.value = true
        setTimeout(() => {
          showSuccessAlert.value = false
        }, 3000)
      })

      emitter.emit('IS_FROM_MAIN_PAGE', true)

    })

    return {
      mobileMenuOpen,
      tabs,
      categories,
      handleListType,
      isGridView,
      isList,
      folders,
      loading,
      folder_id,
      isUpload,
      files,
      loadingFiles,
      docsCountData,
      handleSelectCategory,
      nextFolder,
      handleClickClose,
      showSuccessAlert,
      alertMessage,
      handleChangeTab,
      selectedTab,
      nextPageFile,
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
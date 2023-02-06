<template>
    <div class="pt-4 max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <main class="flex-1 overflow-y-auto h-screen pb-40" ref="scrollFolder" >
            <div
                class="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-300">
                <div>

                    <h4 class="text-2xl font-bold leading-tight text-gray-700">Recent</h4>
                </div>
            </div>
            <Transition name="slide-fade">
                <SuccessAlert v-if="showSuccessAlert" class="mt-2" @handleClickClose="handleClickClose" :message="alertMessage" />
            </Transition>
            <div v-if="todayFolders.length > 0 || todayFiles.length > 0" class=" w-full" >
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-2 border-b border-gray-300">
                    <div>
                
                        <h4 class="text-2xl font-bold leading-tight text-gray-700 mt-5">Today</h4>
                    </div>
                </div>
                <TodayGridView 
                    :filesLength="getTodayList()" 
                    :data="todayFolders" 
                    :type="'folder'" 
                    :loading="loadingToday"
                    :next="nextPageTodayFolder"/>
                <TodayGridView v-if="todayFiles.length > 0"
                    :data="todayFiles" 
                    :type="'file'" 
                    :next="nextPageTodayFile"
                    :filesLength="getLenthOfWeekData()" 
                    :loading="loadingTodayFile"/>
            </div>
            <div v-if="weekFolders.length > 0 || weekFiles.length > 0" class=" w-full">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-2 border-b border-gray-300">
                    <div>
                
                        <h4 class="text-2xl font-bold leading-tight text-gray-700 mt-5">This Week</h4>
                    </div>
                </div>
                <RecentWeekList 
                    :type="'folder'" 
                    :data="weekFolders" 
                    :loading="loadingWeekFolders" 
                    :filesLength="getRecentLength()"
                    :next="nextPageWeekFolder"/>
                <RecentWeekList 
                    :type="'file'" 
                    :data="weekFiles" 
                    :loading="loadingWeekFiles" 
                    :filesLength="getLenthOfMonthData()" 
                    :next="nextPageMonthFolder"/>
            </div>
            <div v-if="monthFolders.length > 0 || monthFiles.length > 0" class=" w-full">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-2 border-b border-gray-300">
                    <div>
                
                        <h4 class="text-2xl font-bold leading-tight text-gray-700 mt-5">This month</h4>
                    </div>
                </div>
                <RecentMonthList 
                    :type="'folder'" 
                    :data="monthFolders" 
                    :loading="loadingMonthFolders" 
                    :filesLength="getMonthData()"
                    :next="nextPageWeekFolder"/>
                <RecentMonthList 
                    :type="'file'" 
                    :data="monthFiles" 
                    :loading="loadingMonthFiles" 
                    :filesLength="getLenthOfYearData()" 
                    :next="nextPageYearFolder"/>
            </div>
            <div v-if="yearFolders.length > 0 || yearFiles.length > 0" class=" w-full">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-2 border-b border-gray-300">
                    <div>
                
                        <h4 class="text-2xl font-bold leading-tight text-gray-700 mt-5">This year</h4>
                    </div>
                </div>
                <RecentYearList 
                    :type="'folder'" 
                    :data="yearFolders" 
                    :loading="loadingYearFolders" 
                    :filesLength="yearFiles.length"
                    :next="nextPageWeekFolder"/>
                <RecentYearList 
                    :type="'file'" 
                    :data="yearFiles" 
                    :loading="loadingYearFiles"  
                    :next="nextPageYearFile"/>
            </div>
        </main>
    </div>
</template>
<script>
import { fetchWithPaginate } from "@/composables/resource_service";
import { setActiveNavBar } from "@/composables/SetActiveNav";
import { computed, defineComponent, onMounted, provide, ref, watch } from "vue";
import { useStore } from "vuex";
import TodayGridView from "@/components/recent/today/TodayGridView.vue";
import { useEmitter } from "@/composables/useEmitter";
import SuccessAlert from "@/components/ui/SuccessAlert.vue";
import RecentWeekList from "@/components/recent/week/RecentWeekList.vue";
import RecentMonthList from "../components/recent/month/RecentMonthList.vue";
import RecentYearList from "../components/recent/year/RecentYearList.vue";
import { setTitle } from "@/composables/title_service";
// import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/solid'

export default defineComponent({
    name: "RecentPage",
    components: {
    TodayGridView,
    SuccessAlert,
    RecentWeekList,
    RecentMonthList,
    RecentYearList
},
    setup() {

        const scrollFolder = ref('')
        const store = useStore();
        const emitter = useEmitter;
        const todayFolders = ref([])
        const tampDataTodayFolder = ref([])
        const todayFiles = ref([])
        const tampDataTodayFile = ref([])
        const loadingToday = ref(false)
        const loadingTodayFile = ref(false)
        const paramsTodayFolders = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })
        const nextPageTodayFolder = ref(null)

        const paramsTodayFiles = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })
        const nextPageTodayFile = ref(null)

        const weekFolders = ref([])
        const weekFiles = ref([])
        const tempWeekFolders = ref([])
        const tempWeekFiles = ref([])
        const loadingWeekFolders = ref(false)
        const loadingWeekFiles = ref(false)
        const nextPageWeekFolder = ref(null)
        const nextPageWeekFile = ref(null)
        const paramsWeekFolders = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })
        const paramsWeekFiles = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })
        const monthFolders = ref([])
        const monthFiles = ref([])
        const tempMonthFolders = ref([])
        const tempMonthFiles = ref([])
        const loadingMonthFolders = ref(false)
        const loadingMonthFiles = ref(false)
        const nextPageMonthFolder = ref(null)
        const nextPageMonthFile = ref(null)
        const paramsMonthFolders = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })
        const paramsMonthFiles = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })
        const yearFolders = ref([])
        const yearFiles = ref([])
        const tempYearFolders = ref([])
        const tempYearFiles = ref([])
        const loadingYearFolders = ref(false)
        const loadingYearFiles = ref(false)
        const nextPageYearFolder = ref(null)
        const nextPageYearFile = ref(null)
        const paramsYearFolders = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })
        const paramsYearFiles = ref({
            pageSize: 50,
            page: 1,
            search: ''
        })

        const alertMessage = ref('')
        const showSuccessAlert = ref(false)

        const handleClickloadMoreTodayFolder = () => {
            if(nextPageTodayFolder.value) {
                paramsTodayFolders.value.page = paramsTodayFolders.value.page + 1;
            }
        }

        const handleClickloadMoreTodayFile = () => {
            if(nextPageTodayFile.value) {
                paramsTodayFiles.value.page = paramsTodayFiles.value.page + 1;
            }
        }

        const todayFolderHistory = async () => {
            loadingToday.value = true
            const {data, load, nextPage} = fetchWithPaginate(paramsTodayFolders.value, '/user/recent/today-folders');
            await load();
            todayFolders.value = data.value.data
            nextPageTodayFolder.value = nextPage.value
            loadingToday.value = false 
        }
        const todayFileHistory = async () => {
            loadingTodayFile.value = true
            const { data, load, nextPage } = fetchWithPaginate(paramsTodayFiles.value, '/user/recent/today-files');
            await load();
            todayFiles.value = data.value.data
            nextPageTodayFile.value = nextPage.value
            loadingTodayFile.value = false 
        }

        watch(paramsTodayFolders.value, async () => {
            tampDataTodayFolder.value = todayFolders.value
            await todayFolderHistory();
            todayFolders.value.forEach(file => {
                tampDataTodayFolder.value.push(file)
            })

            todayFolders.value = tampDataTodayFolder.value
        })

        watch(paramsTodayFiles.value, async () => {
            tampDataTodayFile.value = todayFiles.value
            await todayFileHistory();
            todayFiles.value.forEach(file => {
                tampDataTodayFile.value.push(file)
            })

            todayFiles.value = tampDataTodayFile.value
        })

        // This week files and folders 

        const thisWeekFolderHistory = async () => {
            loadingWeekFolders.value = true
            const {data, load, nextPage} = fetchWithPaginate(paramsWeekFolders.value, '/user/recent/week-folders');
            await load();
            weekFolders.value = data.value.data;
            loadingWeekFolders.value = false
            nextPageWeekFolder.value = nextPage.value
        }

        const thisWeekFileHistory = async () => {
            loadingWeekFiles.value = true
            const { data, load, nextPage } = fetchWithPaginate(paramsWeekFiles.value, '/user/recent/week-files');
            await load();
            weekFiles.value = data.value.data;
            nextPageWeekFile.value = nextPage.value
            loadingWeekFiles.value = false
        }

        const handleClickLoadMoreWeekFolder = () => {
            if(nextPageWeekFolder.value) {
                paramsWeekFolders.value.page = paramsWeekFolders.value.page + 1;
            }
        }

        const handleClickLoadMoreWeekFile = () => {
            if(nextPageWeekFile.value) {
                paramsWeekFiles.value.page = paramsWeekFiles.value.page + 1;
            }
        }

        watch(paramsWeekFolders.value, async () => {
            tempWeekFolders.value = weekFolders.value
            await thisWeekFolderHistory();
            weekFolders.value.forEach(file => {
                tempWeekFolders.value.push(file)
            })

            weekFolders.value = tempWeekFolders.value
        })

        watch(paramsWeekFiles.value, async () => {
            tempWeekFiles.value = weekFiles.value
            await thisWeekFolderHistory();
            weekFiles.value.forEach(file => {
                tempWeekFiles.value.push(file)
            })

            weekFiles.value = tempWeekFiles.value
        })

        // end of this week files and folders 

        // this month files and folders

        const thisMonthFolderHistory = async () => {
            loadingMonthFolders.value = true
            const { data, load, nextPage } = fetchWithPaginate(paramsMonthFolders.value, '/user/recent/month-folders');
            await load();
            monthFolders.value = data.value.data;
            loadingMonthFolders.value = false
            nextPageMonthFolder.value = nextPage.value
        }

        const thisMonthFileHistory = async () => {
            loadingMonthFiles.value = true
            const { data, load, nextPage } = fetchWithPaginate(paramsMonthFiles.value, '/user/recent/month-files');
            await load();
            monthFiles.value = data.value.data;
            nextPageMonthFile.value = nextPage.value
            loadingMonthFiles.value = false
        }

        const handleClickLoadMoreMonthFolder = () => {
            if (nextPageMonthFolder.value) {
                paramsMonthFolders.value.page = paramsMonthFolders.value.page + 1;
            }
        }

        const handleClickLoadMoreMonthFile = () => {
            if (nextPageMonthFile.value) {
                paramsMonthFiles.value.page = paramsMonthFiles.value.page + 1;
            }
        }

        watch(paramsMonthFolders.value, async () => {
            tempMonthFolders.value = monthFolders.value
            await thisMonthFolderHistory();
            monthFolders.value.forEach(file => {
                tempMonthFolders.value.push(file)
            })

            monthFolders.value = tempMonthFolders.value
        })

        watch(paramsMonthFiles.value, async () => {
            tempMonthFiles.value = monthFiles.value
            await thisMonthFileHistory();
            monthFiles.value.forEach(file => {
                tempMonthFiles.value.push(file)
            })

            monthFiles.value = tempMonthFiles.value
        })

        // end of this month files and folders

        const thisYearFolderHistory = async () => {
            loadingYearFolders.value = true
            const { data, load, nextPage } = fetchWithPaginate(paramsYearFolders.value, '/user/recent/year-folders');
            await load();
            yearFolders.value = data.value.data;
            loadingYearFolders.value = false
            nextPageYearFolder.value = nextPage.value
        }

        const thisYearFileHistory = async () => {
            loadingYearFiles.value = true
            const { data, load, nextPage } = fetchWithPaginate(paramsYearFiles.value, '/user/recent/year-files');
            await load();
            yearFiles.value = data.value.data;
            nextPageYearFile.value = nextPage.value
            loadingYearFiles.value = false
        }

        const handleClickLoadMoreYearFolder = () => {
            if (nextPageYearFolder.value) {
                paramsYearFolders.value.page = paramsYearFolders.value.page + 1;
            }
        }

        const handleClickLoadMoreYearFile = () => {
            if (nextPageYearFile.value) {
                paramsYearFiles.value.page = paramsYearFiles.value.page + 1;
            }
        }

        watch(paramsYearFolders.value, async () => {
            tempYearFolders.value = yearFolders.value
            await thisYearFolderHistory();
            yearFolders.value.forEach(file => {
                tempYearFolders.value.push(file)
            })

            yearFolders.value = tempYearFolders.value
        })

        watch(paramsYearFiles.value, async () => {
            tempYearFiles.value = yearFiles.value
            await thisYearFileHistory();
            yearFiles.value.forEach(file => {
                tempYearFiles.value.push(file)
            })

            yearFiles.value = tempYearFiles.value
        })

        provide('loadMoreToday', {
            clickNextPageTodayFolder: handleClickloadMoreTodayFolder,
            clickNextPageTodayFile: handleClickloadMoreTodayFile,
            clickNextPageWeekFolder: handleClickLoadMoreWeekFolder,
            clickNextPageWeekFile: handleClickLoadMoreWeekFile,
            clickNextPageMonthFolder: handleClickLoadMoreMonthFolder,
            clickNextPageMonthFile: handleClickLoadMoreMonthFile,
            clickNextPageYearFile: handleClickLoadMoreYearFile,
            clickNextPageYearFolder: handleClickLoadMoreYearFolder,
        })

        const getTodayList = () => {
            if(todayFiles.value.length > 0) {
                return todayFiles.value.length
            }
            else if (weekFolders.value.length > 0) {
                return weekFolders.value.length
            }
            else if(weekFiles.value.length > 0) {
                return weekFiles.value.length
            }
            else if (monthFolders.value.length > 0) {
                return monthFolders.value.length
            }
            else if (monthFiles.value.length > 0) {
                return monthFiles.value.length
            }
            else if (yearFolders.value.length > 0) {
                return yearFolders.value.length
            }
            else if (yearFiles.value.length > 0) {
                return yearFiles.value.length
            }
            else {
                return 0
            }
        }

        const getRecentLength = () => {
            if (weekFiles.value.length > 0) {
                return weekFiles.value.length
            }
            else if (monthFolders.value.length > 0) {
                return monthFolders.value.length
            }
            else if (monthFiles.value.length > 0) {
                return monthFiles.value.length
            }
            else if (yearFolders.value.length > 0) {
                return yearFolders.value.length
            }
            else if (yearFiles.value.length > 0) {
                return yearFiles.value.length
            }
            else {
                return 0;
            }
        }

        const getLenthOfWeekData = () => {
            if (monthFolders.value.length > 0) {
                return monthFolders.value.length
            }
            else if (monthFiles.value.length > 0) {
                return monthFiles.value.length
            }
            else if (yearFolders.value.length > 0) {
                return yearFolders.value.length
            }
            else if (yearFiles.value.length > 0) {
                return yearFiles.value.length
            }
            else {
                return 0;
            }
        }

        const getLenthOfMonthData = () => {
            if (monthFolders.value.length > 0) {
                return monthFolders.value.length
            }
            else if (monthFiles.value.length > 0) {
                return monthFiles.value.length
            }
            else {
                return 0;
            }
        }

        const getMonthData = () => {
            if(monthFiles.value.length > 0) {
                return monthFiles.value.length
            }
            else if (yearFolders.value.length > 0) {
                return yearFolders.value.length
            }
            else if (yearFiles.value.length > 0) {
                return yearFiles.value.length
            }
            else {
                0
            }
        }

        const getLenthOfYearData = () => {
            if (yearFiles.value.length > 0) {
                return yearFiles.value.length
            }
            else if (yearFolders.value.length > 0) {
                return yearFolders.value.length
            }
            else {
                return 0;
            }
        }

        onMounted( async() => {

            setActiveNavBar('Recent');

            setTitle('Recent');
            await todayFolderHistory();
            await todayFileHistory();
            await thisWeekFolderHistory();
            await thisWeekFileHistory();
            await thisMonthFolderHistory();
            await thisMonthFileHistory();
            await thisYearFolderHistory();
            await thisYearFileHistory();

            emitter.on('SCROLL_TODAY', () => {
                handleClickloadMoreTodayFolder()
            })

            emitter.on('ADD_FAVORITE_FILE_TODAY', ({ type, data }) => {
                if (type == 'folder') {
                    todayFolders.value.map(folder => {
                        if (data.id == folder.id) {
                            for (let key in data) {
                                folder[key] = data[key];
                            }
                        }

                        return folder;
                    })
                }
                else {
                    todayFiles.value.map(file => {
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

            emitter.on('REMOVE_FAVORITE_TODAY', ({ type, data }) => {
                if (type == 'folder') {
                    let index = todayFolders.value.findIndex(folder => folder.favorite.id == data.id);
                    todayFolders.value[index].favorite = null
                }
                else {
                    let index = todayFiles.value.findIndex(folder => folder.favorite.id == data.id);
                    todayFiles.value[index].favorite = null
                }
                alertMessage.value = 'Successfully remove to favorites'
                showSuccessAlert.value = true
                setTimeout(() => {
                    showSuccessAlert.value = false
                }, 3000)
            })

        })

        return {
            isList: computed(() => store.state.isList),
            todayFolders,
            todayFiles,
            alertMessage,
            showSuccessAlert,
            nextPageTodayFolder,
            nextPageTodayFile,
            scrollFolder,
            loadingToday,
            loadingTodayFile,
            weekFolders,
            weekFiles,
            loadingWeekFolders,
            loadingWeekFiles,
            nextPageWeekFolder,
            nextPageWeekFile,
            getLenthOfWeekData,
            getLenthOfMonthData,
            loadingMonthFolders,
            loadingMonthFiles,
            nextPageMonthFolder,
            nextPageMonthFile,
            monthFolders,
            monthFiles,
            yearFolders,
            yearFiles,
            loadingYearFolders,
            loadingYearFiles,
            nextPageYearFolder,
            nextPageYearFile,
            getLenthOfYearData,
            getTodayList,
            getRecentLength,
            getMonthData
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
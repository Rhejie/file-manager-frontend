<template>
    <div class="pt-4 max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <main class="flex-1 overflow-y-auto h-screen">
            <div
                class=" w-full flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-300">
                <div>
    
                    <h4 class="text-2xl font-bold leading-tight text-gray-700">LMS Units</h4>
                </div>
            </div>
            <div class="bg-white mt-2 flex shadow-md w-full p-2  relative">
                <div class="w-full">
                    <div class="w-2/5">
                        <input-text-form :placeholder="'Search Here... and enter'" v-model="search"/>
                    </div>
                    <div class="mx-auto px-4 sm:px-6 ">
                        <GridSkeleton v-if="loadingSearch" />
                        <div v-if="!loadingSearch" class="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                            <div v-for="unit in  units" :key="unit.id">
                                <div class="relative">
                                    <div class="relative h-72 w-full overflow-hidden rounded-lg">
                                        <img :src="unit.thumbnail" :alt="unit.name"
                                            class="h-full w-full" />
                                    </div>
                                    <div class="relative mt-4">
                                        <h3 class="text-sm font-medium text-gray-900">{{ unit.name }}</h3>
                                        <p class="mt-1 text-sm text-gray-500">{{ unit.color }}</p>
                                    </div>
                                    <div class="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                                        <div aria-hidden="true"
                                            class="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50" />
                                        <p class="relative text-lg font-semibold text-white">{{ unit.price }}</p>
                                    </div>
                                </div>
                                <div class="mt-6 b-0">
                                    <button
                                        @click="handleClickAssign(unit)"
                                        class="relative flex items-center 
                                            justify-center rounded-md border 
                                            border-transparent bg-gray-100 py-2 
                                            px-8 text-sm font-medium text-gray-900 
                                            hover:bg-gray-200">
                                                Assign
                                                 <span class="sr-only">, {{ unit.name }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>  
        </main>
        <AssignedUserLmsVideoModal/>
    </div>
</template>
<script>
import { setActiveNavBar } from '@/composables/SetActiveNav';
import { defineComponent, onMounted, ref, watch } from 'vue';
// import SearchUnits from '@/components/lms/SearchUnits.vue'
import InputTextForm from '@/components/ui/InputTextForm.vue'
import { query } from '@/composables/resource_service';
import { accessToken } from '@/composables/local_storage';
import GridSkeleton from '@/components/layout/GridSkeleton.vue';
import AssignedUserLmsVideoModal from '@/components/modal/AssignedUserLmsVideoModal.vue';
import { useEmitter } from '@/composables/useEmitter';

export default defineComponent({
    name: "LmsVideoPage",
    components: {
    // SearchUnits
    InputTextForm,
    GridSkeleton,
    AssignedUserLmsVideoModal
},
    setup() {
        const emitter = useEmitter;
        const search = ref(null);

        const loadingSearch = ref(false)
        const units = ref([])
        const selectedUnit = ref(null)

        const searchUnitsMethod = async (val) => {
            if (!val) {
                units.value = []
                return;
            }
            loadingSearch.value = true
            const { data, load } = query(`file-manager-v2/lms-file-manager/search?search=${val}&tokenFM=${accessToken()}`);
            await load();
            units.value = data.value.results;
            loadingSearch.value = false
        }
        
        const handleClickAssign = (unit) => {
            
            emitter.emit('ASSIGNED_LMS', unit)
        }

        watch(search, (val) => {
            if(val) {
                searchUnitsMethod(val)
                return
            }

            units.value = []
        })

        onMounted(async () => {

            setActiveNavBar("Assign LMS Units");
        
        });
        
        return {
            search,
            handleClickAssign,
            units
        };
    },
})
</script>
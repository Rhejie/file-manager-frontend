<template>
  <div class="hidden w-48 bg-gray-700 overflow-y-auto h-screen border-r-2 md:block">
    <div class="w-full py-6 flex flex-col items-center">
      <div class="flex-shrink-0 flex items-center">
        <!-- <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white" alt="Workflow" /> -->
        <span class="text-white">File Manager</span>
      </div>
      <div class="flex-1 mt-6 w-full px-2 space-y-1">
        <!-- <a v-for="item in navigation" :key="item.name" :href="item.href"
            :class="[item.current ? 'bg-indigo-800 text-white' : 'text-gray-700 hover:bg-indigo-800 hover:text-white', 'group w-full p-3 rounded-md flex  items-center text-xs font-medium']"
            :aria-current="item.current ? 'page' : undefined">
            <component :is="item.icon" class="mr-2"
              :class="[item.current ? 'text-white' : 'text-gray-700 group-hover:text-white', 'h-6 w-6']"
              aria-hidden="true" />
            <span class="mt-2">{{ item.name }}</span>
          </a> -->
        <router-link v-for="(item, index) in navigation" :key="index" :to="{name: item.route_name}"
          :class="[item.current ? 'bg-slate-200 text-gray-500' : 'text-white hover:bg-slate-100 hover:text-gray-600', 'group w-full p-3 rounded-md flex  items-center text-sm font-medium']">
          <component :is="item.icon" class="mr-2"
            :class="[item.current ? 'text-gray-500' : 'text-white group-hover:text-gray-600', 'h-6 w-6']"
            aria-hidden="true" />
          <span class="mt-2">{{ item.name }}</span>
        </router-link>
      </div>
      <!-- <div class="container mx-auto mt-16 justify-center">
            <div class="w-full flex mb-2">
              <p class="text-md text-gray-100 mx-auto self-start">Storage</p>
            </div>
            <div class="h-28 w-28 mx-auto bg-gray-700 rounded-full shadow border-8 border-gray-100 flex items-center justify-center">
                <p class="text-gray-100 text-xs font-bold">100%</p> <DatabaseIcon class="w-5 text-gray-100"/>
            </div>
        </div> -->
    </div>
  </div>

  <!-- Mobile menu -->
  <TransitionRoot as="template" :show="mobileMenuOpen">
    <Dialog as="div" class="relative z-40 md:hidden" @close="mobileMenuOpen = false">
      <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
        enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
      </TransitionChild>

      <div class="fixed inset-0 z-40 flex">
        <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0" leave-to="-translate-x-full">
          <DialogPanel class="relative max-w-xs w-full bg-gray-700 pt-5 pb-4 flex-1 flex flex-col">
            <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
              enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
              <div class="absolute top-1 right-0 -mr-14 p-1">
                <button type="button"
                  class="h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
                  @click="mobileMenuOpen = false">
                  <XIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  <span class="sr-only">Close sidebar</span>
                </button>
              </div>
            </TransitionChild>
            <div class="flex-shrink-0 flex items-center">
              <span class="text-white mx-auto">File Manager</span>
            </div>
            <div class="mt-5 flex-1 h-0 px-2 overflow-y-auto">
              <nav class="h-full flex flex-col">
                <div class="space-y-1">
                  <router-link v-for="(item, index) in navigation" @click="handleClickNav" :key="index" :to="{name: item.route_name}"
                    :class="[item.current ? 'bg-slate-200 text-gray-500' : 'text-white hover:bg-slate-100 hover:text-gray-600', 'group w-full p-3 rounded-md flex  items-center text-sm font-medium']">
                    <component :is="item.icon" class="mr-2"
                      :class="[item.current ? 'text-gray-500' : 'text-white group-hover:text-gray-600', 'h-6 w-6']"
                      aria-hidden="true" />
                    <span class="mt-2">{{ item.name }}</span>
                  </router-link>
                </div>
              </nav>
            </div>
          </DialogPanel>
        </TransitionChild>
        <div class="flex-shrink-0 w-14" aria-hidden="true">
          <!-- Dummy element to force sidebar to shrink to fit close icon -->
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script>
import { computed, defineComponent, onMounted, ref } from "vue";

import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

import {
  XIcon,
  DatabaseIcon
} from '@heroicons/vue/outline'
import { useStore } from "vuex";
import { useEmitter } from "@/composables/useEmitter";
export default defineComponent({
  name: 'SidebarLayout',
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    XIcon,
    DatabaseIcon
  },
  setup() {
    const store = useStore();
    const emitter = useEmitter;

    const navigation = computed(() => store.state.navigation)

    const mobileMenuOpen = ref(false)

    const handleClickNav = () => {
      mobileMenuOpen.value = false
    }

    onMounted(() => {
      emitter.on('OPEN_SIDEBAR', () => {
        console.log('asdsa')
        mobileMenuOpen.value = true
      })
    })

    return {
      navigation,
      mobileMenuOpen,
      handleClickNav
    }
  }
})
</script>
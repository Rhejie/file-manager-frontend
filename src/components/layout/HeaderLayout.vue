<template >
  <header class="w-full">
    <div class="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex">
      <button type="button"
        class="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        @click="handleClickOpenSideBar">
        <span class="sr-only">Open sidebar</span>
        <MenuAlt2Icon class="h-6 w-6" aria-hidden="true" />
      </button>
      <div class="flex-1 flex justify-between px-4 sm:px-6">
        <div class="flex-1 flex">
          <form class="w-full flex md:ml-0" action="#" method="GET">
            <label for="desktop-search-field" class="sr-only">Search all files</label>
            <label for="mobile-search-field" class="sr-only">Search all files</label>
            <div class="relative w-full text-gray-400 focus-within:text-gray-600">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                <SearchIcon class="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              </div>
              <!-- mobile search -->
              <input name="mobile-search-field" id="mobile-search-field"
                class="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:hidden"
                placeholder="Search" type="search" />

              <!-- web search -->
              <!-- <input name="desktop-search-field" id="desktop-search-field"
                class="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:block"
                placeholder="Search all files" type="search" /> -->
                <SearchAll/>
            </div>
          </form>
        </div>
        <div class="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
          <!-- Profile dropdown -->
          <Menu as="div" class="relative flex-shrink-0">
            <div>
              <MenuButton
                class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span class="sr-only">Open user menu</span>
                <LogoutIcon class="h-6 w-6 text-gray-500" aria-hidden="true" />
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95">
              <MenuItems
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }" @click="handleClick(item)">
                <button type="button"  :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">{{
                item.name
                }}</button>
                </MenuItem>
              </MenuItems>
              
            </transition>
          </Menu>

          <!-- <button type="button" @click="handleClickLogout"
            class="flex p-1 rounded-full items-center justify-center text-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <LogoutIcon class="h-6 w-6 text-gray-500" aria-hidden="true" />
            <span class="sr-only">Add file</span>
          </button> -->
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import { defineComponent, inject, ref } from "vue";
import { useCookies } from "vue3-cookies";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,

} from '@headlessui/vue'
import {
  MenuAlt2Icon,
  // PlusSmIcon as PlusSmIconOutline,
} from "@heroicons/vue/outline"
import { SearchIcon, LogoutIcon } from "@heroicons/vue/solid"
import { useEmitter } from "@/composables/useEmitter";
import SearchAll from "../settings/SearchAll.vue";
export default defineComponent({
  name: "HeaderLayout",
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    SearchIcon,
    MenuAlt2Icon,
    // PlusSmIconOutline,
    LogoutIcon,
    SearchAll
},
  setup() {
    const mobileMenuOpen = ref(false)
    const emitter = useEmitter;

    const auth = inject('auth');
    const http = inject('http');
    const { cookies } = useCookies();

    const userNavigation = [
      { name: 'Your profile', href: '#' },
      { name: 'Sign out', href: '#' },
    ]

    const handleClick = (data) => {
      if(data.name == 'Sign out') {
        handleClickLogout();
      }
    }

    const handleClickOpenSideBar = () => {
      emitter.emit('OPEN_SIDEBAR');
    }

    const handleClickLogout = () => {
      let user = JSON.parse(auth.remember())
      const accessToken = `Bearer ${auth.token()}`;
      localStorage.removeItem('file_manager_access_token');
      http.defaults.headers.common['Authorization'] = accessToken;
      window.location.href = '/saml2/central/logout';
      cookies.keys().forEach(cookie => cookies.remove(cookie))
    }

    return {
      mobileMenuOpen,
      userNavigation,
      handleClickLogout,
      handleClick,
      handleClickOpenSideBar
    }
  }
})
</script>
import { createStore } from 'vuex'
import {
  // CogIcon,
  // HomeIcon,
  UserGroupIcon,
  ViewGridIcon as ViewGridIconOutline,
  TrashIcon,
  ClockIcon,
  HeartIcon,
} from '@heroicons/vue/outline'

export default createStore({
  state: {
    navigation: [
      // { name: 'Home', route_name: 'Home', icon: HomeIcon, current: false },
      { name: 'All Files', route_name: 'All Files', icon: ViewGridIconOutline, current: false },
      { name: 'Assign to me', route_name: 'Assigned Files', icon: UserGroupIcon, current: false },
      { name: 'Recent', route_name: 'Recent Files', icon: ClockIcon, current: false },
      { name: 'Favorites', route_name: 'Favorite Files', icon: HeartIcon, current: false },
      { name: 'Trash', route_name: 'Trash Files', icon: TrashIcon, current: false },
      // { name: 'Settings', route_name: 'Settings Appearance', icon: CogIcon, current: false },
    ],
    isList: false,
    central_porfile: {},
    central_auth_token: null,
    mainDisplayId: null,
    userProfile: {}
  },
  getters: {
  },
  mutations: {
    setActiveNavBar(state, payload) {
      state.adminNavBar = state.navigation.map((nav) => {
        if (nav.name === payload) {
          nav.current = true;
        }
        else {
          nav.current = false;
        }

        return nav;
      })
    },
    setListActive(state, payload) {
      state.isList = payload
    },
    setCentralProfile(state, payload) {
      state.central_porfile = payload
    },
    setCentralToken(state, payload) {
      state.central_auth_token = payload
    },
    setMainDisplayId(state, payload) {
      state.mainDisplayId = payload
    },
    setUserProfile(state, payload) {
      state.userProfile = payload
    }
  },
  actions: {
  },
  modules: {
  }
})

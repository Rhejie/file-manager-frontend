import store from '../store/index'
export const setActiveNavBar = (name) => {
    store.commit('setActiveNavBar', name)
}

export const setListActive = (status) => {
    store.commit('setListActive', status)
}

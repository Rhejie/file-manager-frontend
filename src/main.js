import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/tailwind.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createAuth } from '@websanova/vue-auth';
import driverAuthBearer from '@websanova/vue-auth/dist/drivers/auth/bearer.esm.js';
import driverHttpAxios from '@websanova/vue-auth/dist/drivers/http/axios.1.x.esm.js';
import driverRouterVueRouter from '@websanova/vue-auth/dist/drivers/router/vue-router.2.x.esm.js';
import mitt from 'mitt';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import infiniteScroll from 'vue3-infinite-scroll-better'

const app = createApp(App)
const emitter = mitt();

const instance = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
    },
});

instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

var auth = createAuth({
    plugins: {
        http: axios,
        router: router
    },
    drivers: {
        http: driverHttpAxios,
        auth: driverAuthBearer,
        router: driverRouterVueRouter,
    },
    tokenStore: ['localStorage'],
    options: {
        fetchData: { enabled: false },
        rolesKey: 'type',
        notFoundRedirect: { name: 'user-account' },
    }
});

app.config.globalProperties.emitter = emitter;
// app.use(ElementPlus)
app.use(VueAxios, instance)
app.use(auth)
app.provide('auth', auth)
app.use(ElementPlus)
app.use(infiniteScroll)
app.provide('http', app.config.globalProperties.axios)
app.use(store).use(router).mount('#app')

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/sso/login',
    name: 'SSO login',
    component: () => import('@/views/auth/AuthLoginPage.vue'),
    meta: {
      auth: false,
    },
  },
  {
    path: '/login',
    name: "login",
    component: () => import('@/views/Login.vue'),
    meta: {
      auth: false,
      title: 'Login'
    }
  },
  {
    path: '/',
    component: () => import('@/views/WelcomePage.vue'),
    meta: {
      auth: true,
    },
    children: [
      // {
      //   path: '',
      //   name: "Home",
      //   meta: {  
      //     auth: true
      //   },
      //   component: () => import('@/views/HomePage.vue'),
      // },
      {
        path: '/files/recent',
        name: "Recent Files",
        component: () => import('@/views/RecentPage.vue')
      },
      {
        path: '',
        component: () => import("@/views/ViewFiles.vue"),
        children: [
          {
            path: '',
            name: "All Files",
            component: () => import("@/views/FilesPage.vue")
          },
          {
            path: '/files/recent',
            name: "Recent Files",
            component: () => import('@/views/RecentPage.vue')
          },
          {
            path: '/files/assign',
            name: "Assigned Files",
            component: () => import("@/views/AssignedPage.vue")
          },
          {
            path: '/files/favorites',
            name: "Favorite Files",
            component: () => import("@/views/FavoritePage.vue")
          },
          {
            path: '/files/trash',
            name: "Trash Files",
            component: () => import("@/views/TrashPage.vue")
          },
          {
            path: '/files/folder/:id',
            name: "Open Folder",
            component: () => import("@/views/folder/FolderPage.vue"),
            props: true
          },
          {
            path: '/files/assigned/:id',
            name: "Assigned Folder",
            props: true,
            component: () => import('@/views/assgined/AssginedFolderPage.vue')
          },
          {
            path: '/files/search',
            name: "Search All",
            props: true,
            component: () => import('@/views/SearchAllPage.vue')
          },
          {
            path: '/widget/:type',
            name: "Widget Page",
            props: true,
            component: () => import('@/views/WidgetPage.vue')
          },
          {
            path: '/files/lms-video',
            name: 'Lms Video',
            component: () => import('@/views/LmsVideoPage.vue')
          }
        ],
        meta: {
          auth: true
        },
      }
    ]
  },
  {
    path: '/404',
    name: "user-account",
    component: () => import("@/views/NotFoundPage.vue")
  }
]

const router = createRouter({
  history: createWebHistory(),
  base: ['staging', 'production'].includes(process.env.NODE_ENV)
    ? '/'
    : process.env.BASE_URL,
  routes
})

export default router

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import './assets/globals.css'

import { createApp } from 'vue'
import { createPinia, getActivePinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from "./stores/auth"

import piniaPluginPersistedState from "pinia-plugin-persistedstate"

const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)

// router.beforeEach((to) => {
//     const main = useAuthStore(pinia)
//   })

app.mount('#app')


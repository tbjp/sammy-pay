import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'
import { useAppStore } from './stores/store'

const pinia = createPinia()
pinia.use(piniaPersistedState)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

const appStore = useAppStore()
window.appStore = appStore

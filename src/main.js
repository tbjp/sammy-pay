import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate-2'

const pinia = createPinia()
pinia.use(piniaPersistedState)

const app = createApp(App)
app.use(pinia)
app.mount('#app')

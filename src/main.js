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

let timeout
window.addEventListener('storage', (event) => {
  console.log("Storage event: ")
  console.log(event)
  if (event.key === 'app') {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      const store = useAppStore()
      const newState = JSON.parse(event.newValue)
      if (newState) store.$patch(newState)
    }, 100)
  }
})

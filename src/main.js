import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'
import { useAppStore } from './stores/store'
import { supabase } from './lib/supabaseClient'
import { startSyncLoop } from './utilities/syncLoop'

const pinia = createPinia()
pinia.use(piniaPersistedState)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

const appStore = useAppStore()
window.appStore = appStore

appStore.fetchUser()

// Restore session on reload
// supabase.auth.getSession().then(({ data: { session } }) => {
//   if (session?.user) {
//     appStore.setUser(session.user)
//   }
// })

// supabase.auth.onAuthStateChange((_event, session) => {
//   const store = useAppStore()
//   if (session?.user) {
//     store.setUser(session.user)
//   } else {
//     store.setUser(null)
//   }
// })

supabase.auth.onAuthStateChange(() => {
  appStore.fetchUser()
})

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

// startSyncLoop(appStore)

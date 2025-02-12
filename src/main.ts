import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import lazyLoad from './directives/lazy-load'
import type { Router } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router;
  }
}

const app = createApp(App)
const pinia = createPinia()
pinia.use(({store}) => {
  store.$router = markRaw(router)
})

app.use(pinia)
app.use(router)

app.mount('#app')

app.directive('lazy-load', lazyLoad)

const authStore = useAuthStore()

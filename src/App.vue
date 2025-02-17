<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted, ref } from 'vue'
import Menu from './components/Menu.vue';
import { useAuthStore } from '@/stores/useAuthStore'
import router from '@/router'

const authStore = useAuthStore()

const showProfileMenu = ref(false)

const toggleShowProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
}

const logout = () => {
  authStore.logout()
  toggleShowProfileMenu()
  router.push('/login')
}

onMounted(() => {
  authStore.checkAuth()
  if (authStore.token) {
    router.push('/')
  } else {
    authStore.logout()
    router.push('/login')
  }
});
</script>

<template>
  <div class="app-wrapper">

    <header class="header">
      <RouterLink to="/" class="header__logo-link">
        <img alt="Vue logo" class="header__logo" src="@/assets/logo.png" width="153" height="50" />
      </RouterLink>

      <div class="header__menu">
        <Menu />
        <!-- <div class="header__profile glass">🔔</div> -->
        <div class="header__profile glass" @click="toggleShowProfileMenu">
          <img style="width: 20px; height: 20px;"  src="@/assets/technologist.png" alt="technologist" />
        </div>
        <div class="header-profile-menu" v-if="showProfileMenu">
          <div class="logout" @click="logout">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 21C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H12V5H5V19H12V21H5ZM16 17L14.625 15.55L17.175 13H9V11H17.175L14.625 8.45L16 7L21 12L16 17Z" fill="#5A5A5A"/>
            </svg>
          </div>
        </div>
      </div>
    </header>

    <main>
      <RouterView />
    </main>


    <footer>
      <div class="footer-container">

      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  line-height: 1.5;
  display: flex;
  justify-content: space-between;

  margin-bottom: 80px;
  margin-top: 20px;
}

main {
  flex: 1;
}

footer {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.footer-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 1140px;
  width: 100%;
}

.company {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;

  color: #5A5A5A;
}

.header__logo {
  display: block;
}

.header__menu {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
}

.header__profile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;

  border-radius: 999px;

  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;

  color: var(--color-text);

  cursor: pointer;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

.header-profile-menu {
  position: absolute;
  right: 0;
  top: 60px;
}

.logout {
  width: 50px;
  height: 50px;
  background-color: #fff;
  border-radius: 99px;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
}
</style>

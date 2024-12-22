<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Menu from './components/Menu.vue';
import { computed } from 'vue';

const isAuth = computed(() => {
  return localStorage.getItem('token');
});
</script>

<template>
  <div class="app-wrapper">

    <header class="header">
      <img alt="Vue logo" class="header__logo" src="@/assets/logo.png" width="153" height="50" />

      <div class="header__menu" v-if="isAuth">
        <Menu />
        <div class="header__profile glass">🔔</div>
        <div class="header__profile glass">🧑‍💻</div>
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
</style>

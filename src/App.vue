<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Menu from './components/Menu.vue';
</script>

<template>
  <div class="app-wrapper">

    <header class="header">
      <img alt="Vue logo" class="header__logo" src="@/assets/logo.png" width="153" height="50" />

      <div class="header__menu">
        <Menu />
        <div class="header__profile glass">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 19V10C6 8.4087 6.63214 6.88258 7.75736 5.75736C8.88258 4.63214 10.4087 4 12 4C13.5913 4 15.1174 4.63214 16.2426 5.75736C17.3679 6.88258 18 8.4087 18 10V19M6 19H18M6 19H4M18 19H20M11 22H13"
              stroke="black" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M12 4C12.5523 4 13 3.55228 13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3C11 3.55228 11.4477 4 12 4Z"
              stroke="black" />
          </svg>


        </div>
        <div class="header__profile glass">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M12.0001 1.25C10.7403 1.25 9.5321 1.75044 8.6413 2.64124C7.7505 3.53204 7.25006 4.74022 7.25006 6C7.25006 7.25978 7.7505 8.46796 8.6413 9.35876C9.5321 10.2496 10.7403 10.75 12.0001 10.75C13.2598 10.75 14.468 10.2496 15.3588 9.35876C16.2496 8.46796 16.7501 7.25978 16.7501 6C16.7501 4.74022 16.2496 3.53204 15.3588 2.64124C14.468 1.75044 13.2598 1.25 12.0001 1.25ZM8.75006 6C8.75006 5.13805 9.09247 4.3114 9.70196 3.7019C10.3115 3.09241 11.1381 2.75 12.0001 2.75C12.862 2.75 13.6887 3.09241 14.2982 3.7019C14.9076 4.3114 15.2501 5.13805 15.2501 6C15.2501 6.86195 14.9076 7.6886 14.2982 8.2981C13.6887 8.90759 12.862 9.25 12.0001 9.25C11.1381 9.25 10.3115 8.90759 9.70196 8.2981C9.09247 7.6886 8.75006 6.86195 8.75006 6ZM12.0001 12.25C9.68706 12.25 7.55506 12.776 5.97606 13.664C4.42006 14.54 3.25006 15.866 3.25006 17.5V17.602C3.24906 18.764 3.24806 20.222 4.52706 21.264C5.15606 21.776 6.03706 22.141 7.22706 22.381C8.41906 22.623 9.97406 22.75 12.0001 22.75C14.0261 22.75 15.5801 22.623 16.7741 22.381C17.9641 22.141 18.8441 21.776 19.4741 21.264C20.7531 20.222 20.7511 18.764 20.7501 17.602V17.5C20.7501 15.866 19.5801 14.54 18.0251 13.664C16.4451 12.776 14.3141 12.25 12.0001 12.25ZM4.75006 17.5C4.75006 16.649 5.37206 15.725 6.71106 14.972C8.02706 14.232 9.89506 13.75 12.0011 13.75C14.1051 13.75 15.9731 14.232 17.2891 14.972C18.6291 15.725 19.2501 16.649 19.2501 17.5C19.2501 18.808 19.2101 19.544 18.5261 20.1C18.1561 20.402 17.5361 20.697 16.4761 20.911C15.4191 21.125 13.9741 21.25 12.0001 21.25C10.0261 21.25 8.58006 21.125 7.52406 20.911C6.46406 20.697 5.84406 20.402 5.47406 20.101C4.79006 19.544 4.75006 18.808 4.75006 17.5Z"
              fill="black" />
          </svg>

        </div>
      </div>


    </header>

    <main>
      <RouterView />
    </main>


    <footer>
      <div class="footer-container">
        <p class="company">2024 Alpengötter, Inc.</p>
        <div class="mark">
          <svg width="24" height="38" viewBox="0 0 24 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_337_144)">
              <path
                d="M16.0333 20.5885H18.7559V32.7228H10.0503C6.55445 32.7228 5.24363 31.4118 5.24363 27.9162V20.5885H7.96619V27.9833C7.96619 29.5296 8.57126 30.1683 9.98302 30.1683H16.0333V20.5885ZM2.62173 3.10983H21.3778V35.3782H2.62173V3.10983ZM0 37.9999H23.9996V0.488056H0V37.9999ZM14.6889 11.0761H7.96619V8.31981H14.6889C15.6971 8.31981 16.1677 8.85772 16.1677 9.66433C16.1677 10.4711 15.7643 11.0761 14.6889 11.0761ZM18.8905 9.3618C18.8905 7.34508 17.9157 5.76531 15.0584 5.76531H5.24363V17.8995H7.96619V13.6306H14.2518C15.6636 13.6306 16.0333 14.034 16.0333 15.4458V17.8995H18.7559V15.0087C18.7559 13.5669 18.2444 12.7211 17.1083 12.4333C18.2903 12.0338 18.8905 10.891 18.8905 9.3618Z"
                fill="#231F20" />
            </g>
            <defs>
              <clipPath id="clip0_337_144">
                <rect width="24" height="37.5113" fill="white" transform="translate(0 0.48877)" />
              </clipPath>
            </defs>
          </svg>
        </div>
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

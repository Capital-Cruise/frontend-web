<template>
  <div class="login-view">
    <LoginCard @login-success="onLoginSuccess" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import LoginCard from '../components/LoginCard.component.vue'

const router = useRouter()

function onLoginSuccess(user) {
  router.push('/')
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
}
</style>
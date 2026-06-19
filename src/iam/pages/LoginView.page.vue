<template>
  <div class="login-view">
    <LoginCard />
  </div>
</template>

<script setup>
import LoginCard from '../components/LoginCard.component.vue'
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 24px;
  background: #f4f7fb;
}
</style>

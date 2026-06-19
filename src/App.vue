<template>
  <router-view />
  <ToastContainer />
</template>

<script setup>
import ToastContainer from './shared/components/ToastContainer.component.vue'
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f7fb;
  color: #0b1f3a;
}
</style>
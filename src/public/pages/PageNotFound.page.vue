<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Página no encontrada</p>
    <router-link to="/">Ir al panel principal</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 80px 20px;
}
.not-found h1 {
  font-size: 72px;
  color: #08264a;
}
.not-found a {
  color: #08264a;
  font-weight: 700;
}
</style>

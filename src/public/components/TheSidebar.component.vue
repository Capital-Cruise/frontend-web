<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-logo">CAPITALCRUISE</div>
      <div class="brand-subtitle">Loan Advisory Portal</div>
    </div>
    <nav>
      <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav"
          active-class="active"
          exact-active-class="active"
      >
        {{ item.label }}
      </router-link>
    </nav>
    <div class="sidebar-footer">
      <button class="danger subtle" @click="$emit('logout')">Logout</button>
    </div>
  </aside>
</template>

<script setup>
const emit = defineEmits(['logout'])

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/clients', label: 'Clients' },
  { path: '/vehicles', label: 'Vehicles' },
  { path: '/simulation', label: 'New Simulation' },
  { path: '/operations', label: 'Saved Operations' },
  { path: '/support', label: 'Support' }
]
</script>

<style scoped>
.sidebar {
  background: #f6f9fd;
  border-right: 1px solid #e3e8ef;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  text-align: center;
}

.brand-logo {
  font-family: Georgia, serif;
  font-size: 24px;
  color: #08264a;
  line-height: 1;
}

.brand-subtitle {
  color: #6f7d8f;
  font-size: 12px;
  margin-top: 4px;
}

.sidebar nav {
  display: grid;
  gap: 8px;
}

.nav {
  display: block;
  text-align: left;
  background: transparent;
  color: #53657c;
  border: 0;
  border-radius: 0;
  border-left: 4px solid transparent;
  padding: 12px 16px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.nav.active {
  background: #d9e6ff;
  color: #08264a;
  border-left-color: #08264a;
}

.nav:hover {
  background: #e8eff7;
}

.sidebar-footer {
  margin-top: auto;
}

.danger {
  background: #f9d9dc;
  color: #8f1521;
  border: 0;
  border-radius: 8px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
}

.subtle {
  background: transparent;
}

@media (max-width: 1180px) {
  .sidebar {
    position: static;
    height: auto;
  }
}
</style>
<template>
  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="toast">
      <article
        v-for="toast in toastService.state.toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
        role="status"
      >
        <span class="toast-icon" aria-hidden="true">
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.06 14.54L7.4 12l1.41-1.41 2.13 2.13 4.53-4.53L16.88 9 10.94 15.54z"
              fill="currentColor"
            />
          </svg>
          <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="currentColor"
            />
          </svg>
          <svg v-else-if="toast.type === 'warning'" viewBox="0 0 24 24">
            <path
              d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
              fill="currentColor"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
              fill="currentColor"
            />
          </svg>
        </span>
        <div class="toast-content">
          <strong>{{ titleFor(toast.type) }}</strong>
          <p>{{ toast.message }}</p>
        </div>
        <button
          type="button"
          class="toast-close"
          aria-label="Close notification"
          @click="toastService.dismiss(toast.id)"
        >
          ×
        </button>
      </article>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { toastService } from '../services/toast.service.js'

function titleFor(type) {
  const titles = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Notice'
  }
  return titles[type] || 'Notice'
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: grid;
  gap: 12px;
  width: min(380px, calc(100vw - 32px));
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: start;
  padding: 16px 18px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #e3e8ef;
  box-shadow: 0 16px 40px rgba(8, 38, 74, 0.12);
}

.toast.success {
  border-left: 4px solid #059669;
}

.toast.error {
  border-left: 4px solid #dc2626;
}

.toast.warning {
  border-left: 4px solid #d97706;
}

.toast.info {
  border-left: 4px solid #2563eb;
}

.toast-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.toast-icon svg {
  width: 18px;
  height: 18px;
}

.toast.success .toast-icon {
  background: #dcfce7;
  color: #059669;
}

.toast.error .toast-icon {
  background: #fee2e2;
  color: #dc2626;
}

.toast.warning .toast-icon {
  background: #fef3c7;
  color: #d97706;
}

.toast.info .toast-icon {
  background: #dbeafe;
  color: #2563eb;
}

.toast-content strong {
  display: block;
  font-size: 14px;
  color: #0b1f3a;
  margin-bottom: 4px;
}

.toast-content p {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: #4a5568;
  word-break: break-word;
}

.toast-close {
  border: 0;
  background: transparent;
  color: #8a96a3;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
}

.toast-close:hover {
  color: #08264a;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.28s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.toast-move {
  transition: transform 0.28s ease;
}

@media (max-width: 480px) {
  .toast-container {
    top: auto;
    bottom: 24px;
    right: 16px;
    left: 16px;
    width: auto;
  }
}
</style>

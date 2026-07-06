<template>
  <component
    :is="tag"
    ref="rootRef"
    class="field-help"
    :class="[`field-help--${layout}`, { 'field-help--open': isOpen }]"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <div class="field-help__header">
      <span class="field-help__label">
        <slot name="label">{{ helpEntry.title }}</slot>
      </span>
      <button
        type="button"
        class="field-help__icon"
        :aria-expanded="isOpen"
        :aria-controls="tooltipId"
        aria-label="Mostrar ayuda contextual"
        @click.stop="toggleFromIcon"
      >
        ?
      </button>
    </div>

    <slot />

    <teleport to="body">
      <div
        v-if="isOpen"
        :id="tooltipId"
        ref="tooltipRef"
        class="field-help__tooltip"
        role="tooltip"
        :style="tooltipStyle"
        @mouseenter="cancelClose"
        @mouseleave="closeTooltip"
      >
        <strong>{{ helpEntry.title }}</strong>
        <p>{{ helpEntry.description }}</p>
        <a :href="helpEntry.supportAnchor">Ver más en Ayuda</a>
      </div>
    </teleport>
  </component>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { getFieldHelp } from '../help/field-help-content.js'

const props = defineProps({
  topic: { type: String, required: true },
  tag: { type: String, default: 'label' },
  layout: { type: String, default: 'stacked' },
  delay: { type: Number, default: 800 }
})

const rootRef = ref(null)
const tooltipRef = ref(null)
const isOpen = ref(false)
const tooltipStyle = ref({})
const anchorPoint = ref({ x: 0, y: 0 })

const openTimer = ref(null)
const closeTimer = ref(null)
const tooltipId = `field-help-${Math.random().toString(36).slice(2, 10)}`

const helpEntry = computed(() => getFieldHelp(props.topic))

function clearTimers() {
  window.clearTimeout(openTimer.value)
  window.clearTimeout(closeTimer.value)
}

function updatePosition() {
  const root = rootRef.value?.$el || rootRef.value
  if (!root) return

  const rect = root.getBoundingClientRect()
  const width = Math.min(320, Math.max(248, rect.width))
  let left = anchorPoint.value.x ? anchorPoint.value.x + 16 : rect.left
  let top = anchorPoint.value.y ? anchorPoint.value.y + 16 : rect.bottom + 12

  if (left + width + 16 > window.innerWidth) {
    left = Math.max(16, (anchorPoint.value.x || rect.right) - width - 16)
  }

  if (top + 180 > window.innerHeight) {
    top = Math.max(16, (anchorPoint.value.y || rect.top) - 168)
  }

  tooltipStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    zIndex: 4000
  }
}

async function openTooltip() {
  clearTimers()
  if (isOpen.value) {
    updatePosition()
    return
  }

  isOpen.value = true
  await nextTick()
  updatePosition()
  window.addEventListener('scroll', closeTooltip, true)
  window.addEventListener('resize', closeTooltip)
  window.addEventListener('keydown', onKeyDown)
}

function scheduleOpen() {
  clearTimers()
  openTimer.value = window.setTimeout(() => {
    openTooltip()
  }, props.delay)
}

function closeTooltip() {
  clearTimers()
  if (!isOpen.value) return

  isOpen.value = false
  window.removeEventListener('scroll', closeTooltip, true)
  window.removeEventListener('resize', closeTooltip)
  window.removeEventListener('keydown', onKeyDown)
}

function cancelClose() {
  window.clearTimeout(closeTimer.value)
}

function queueClose() {
  window.clearTimeout(closeTimer.value)
  closeTimer.value = window.setTimeout(() => {
    const root = rootRef.value?.$el || rootRef.value
    const tooltip = tooltipRef.value
    const active = document.activeElement

    if (root?.contains(active) || tooltip?.contains(active)) {
      return
    }

    closeTooltip()
  }, 80)
}

function onMouseEnter(event) {
  if (event.pointerType === 'touch') return
  anchorPoint.value = { x: event.clientX, y: event.clientY }
  scheduleOpen()
}

function onMouseMove(event) {
  anchorPoint.value = { x: event.clientX, y: event.clientY }
  if (isOpen.value) {
    updatePosition()
  }
}

function onMouseLeave(event) {
  const nextTarget = event.relatedTarget
  const tooltip = tooltipRef.value
  if (tooltip && nextTarget instanceof Node && tooltip.contains(nextTarget)) {
    return
  }
  closeTooltip()
}

function onFocusIn() {
  const root = rootRef.value?.$el || rootRef.value
  const rect = root?.getBoundingClientRect?.()
  if (rect) {
    anchorPoint.value = { x: rect.left, y: rect.bottom }
  }
  openTooltip()
}

function onFocusOut() {
  queueClose()
}

function toggleFromIcon() {
  if (isOpen.value) {
    closeTooltip()
    return
  }
  openTooltip()
}

function onKeyDown(event) {
  if (event.key === 'Escape') {
    closeTooltip()
  }
}

onBeforeUnmount(() => {
  closeTooltip()
  clearTimers()
})
</script>

<style scoped>
.field-help {
  position: relative;
  display: grid;
  gap: 6px;
  width: 100%;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}

.field-help__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-help__label {
  flex: 1;
}

.field-help__icon {
  width: 20px;
  height: 20px;
  border: 1px solid #c7d6ea;
  border-radius: 999px;
  background: #f8fbff;
  color: #0b4f9c;
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.field-help__icon:hover,
.field-help__icon:focus-visible,
.field-help--open .field-help__icon {
  border-color: #7ea6e6;
  background: #eaf2ff;
  outline: none;
}

.field-help__tooltip {
  display: grid;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgba(11, 31, 58, 0.08);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 18px 40px rgba(8, 38, 74, 0.18);
  color: #334155;
}

.field-help__tooltip strong {
  color: #0b1f3a;
  font-size: 14px;
}

.field-help__tooltip p {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  font-weight: 500;
}

.field-help__tooltip a {
  color: #0b4f9c;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.field-help__tooltip a:hover,
.field-help__tooltip a:focus-visible {
  text-decoration: underline;
  outline: none;
}

@media (max-width: 640px) {
  .field-help__tooltip {
    width: min(320px, calc(100vw - 24px)) !important;
  }
}
</style>

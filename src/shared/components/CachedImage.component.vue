<template>
  <img
    :src="currentSrc"
    :alt="alt"
    :class="className"
    :loading="loading"
    :decoding="decoding"
    @error="handleError"
  />
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { resolveCachedImageUrl } from '../utils/image-cache.util.js'

const props = defineProps({
  src: { type: String, default: '' },
  fallbackSrc: { type: String, default: '' },
  alt: { type: String, default: '' },
  className: { type: String, default: '' },
  loading: { type: String, default: 'lazy' },
  decoding: { type: String, default: 'async' }
})
const emit = defineEmits(['error'])

const currentSrc = ref(props.src || props.fallbackSrc || '')
let requestToken = 0

async function loadImage(source) {
  const token = ++requestToken
  const nextSource = source || props.fallbackSrc || ''

  if (!nextSource) {
    currentSrc.value = ''
    return
  }

  currentSrc.value = nextSource

  const cachedSource = await resolveCachedImageUrl(nextSource)
  if (token !== requestToken) return

  currentSrc.value = cachedSource || nextSource
}

function handleError() {
  if (props.fallbackSrc && currentSrc.value !== props.fallbackSrc) {
    loadImage(props.fallbackSrc)
    return
  }

  currentSrc.value = props.fallbackSrc || props.src || ''
  emit('error')
}

watch(
  () => [props.src, props.fallbackSrc],
  ([src]) => {
    loadImage(src)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  requestToken += 1
})
</script>

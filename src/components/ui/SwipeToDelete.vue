<script setup lang="ts">
import { ref } from 'vue'
import trashIcon from '@/assets/images/trash.svg'

/**
 * Adaptación web del "swipe para eliminar" del diseño:
 * - En desktop (con mouse) el contenido se corre al pasar el cursor y revela
 *   el botón rojo de eliminar a la derecha.
 * - En táctil se revela deslizando el dedo (swipe horizontal).
 * Emite `delete` al pulsar el basurero.
 */
const emit = defineEmits<{ delete: [] }>()

const REVEAL = 76
const offset = ref(0)
const dragging = ref(false)
let startX = 0
let startOffset = 0

const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window

function onEnter() {
  if (!isTouch) offset.value = -REVEAL
}
function onLeave() {
  if (!isTouch && !dragging.value) offset.value = 0
}
function onTouchStart(e: TouchEvent) {
  dragging.value = true
  startX = e.touches[0]!.clientX
  startOffset = offset.value
}
function onTouchMove(e: TouchEvent) {
  if (!dragging.value) return
  const dx = e.touches[0]!.clientX - startX
  offset.value = Math.max(-REVEAL, Math.min(0, startOffset + dx))
}
function onTouchEnd() {
  dragging.value = false
  offset.value = offset.value < -REVEAL / 2 ? -REVEAL : 0
}
</script>

<template>
  <div class="swipe" @mouseenter="onEnter" @mouseleave="onLeave">
    <button class="swipe__delete" type="button" aria-label="Eliminar de favoritos" @click="emit('delete')">
      <img class="swipe__trash" :src="trashIcon" alt="" />
    </button>
    <div
      class="swipe__content"
      :class="{ 'swipe__content--dragging': dragging }"
      :style="{ transform: `translateX(${offset}px)` }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.swipe {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* El fondo rojo ocupa toda la card (basurero a la derecha) para que, al
   deslizar, siempre se revele rojo detrás y nunca quede un hueco blanco. */
.swipe__delete {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 26px;
  background: var(--color-danger);
  color: #fff;
}

.swipe__trash {
  width: 28px;
  height: 28px;
}

.swipe__content {
  position: relative;
  transition: transform 0.25s ease;
  touch-action: pan-y;
}

.swipe__content--dragging {
  transition: none;
}

/* Sin el "levantado" de hover dentro del swipe: evita el borde recortado. */
.swipe__content :deep(.card:hover) {
  transform: none;
  box-shadow: none;
}
</style>

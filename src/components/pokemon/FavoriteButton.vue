<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'

withDefaults(defineProps<{ active: boolean; size?: number; variant?: 'chip' | 'plain' }>(), {
  size: 20,
  variant: 'chip',
})
const emit = defineEmits<{ toggle: [] }>()

/** Detiene la propagación para no disparar el click de la card contenedora. */
function onClick(event: MouseEvent) {
  event.stopPropagation()
  emit('toggle')
}
</script>

<template>
  <button
    type="button"
    class="fav"
    :class="[`fav--${variant}`, { 'fav--active': active }]"
    :aria-pressed="active"
    :aria-label="active ? 'Quitar de favoritos' : 'Añadir a favoritos'"
    @click="onClick"
  >
    <AppIcon :name="active ? 'heart-filled' : 'heart'" :size="size" />
  </button>
</template>

<style scoped>
.fav {
  display: grid;
  place-items: center;
  color: var(--color-text-secondary);
  transition:
    transform 0.15s ease,
    color 0.15s ease;
}

.fav--chip {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(2px);
}

.fav--active {
  color: var(--color-danger);
}

.fav:active {
  transform: scale(0.85);
}

.fav:hover {
  color: var(--color-danger);
}
</style>

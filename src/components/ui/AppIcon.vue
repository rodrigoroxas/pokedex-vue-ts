<script setup lang="ts">
import { computed } from 'vue'

/**
 * Set de íconos SVG (estilo línea, 24×24) usados en la app. Centralizarlos
 * en un único componente evita duplicar markup SVG y homogeneiza tamaños y
 * colores (heredan `currentColor`).
 */
export type IconName =
  | 'home'
  | 'globe'
  | 'heart'
  | 'heart-filled'
  | 'user'
  | 'search'
  | 'arrow-left'
  | 'share'
  | 'trash'
  | 'close'
  | 'filter'
  | 'chevron-down'
  | 'weight'
  | 'ruler'
  | 'category'
  | 'ability'
  | 'pokeball'
  | 'male'
  | 'female'
  | 'check'

const props = withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 24 })

const ICON_PATHS: Record<IconName, string> = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z',
  heart: 'M20.8 5.6a5.4 5.4 0 0 0-7.7 0L12 6.7l-1.1-1.1a5.4 5.4 0 1 0-7.7 7.7L12 22l8.8-8.7a5.4 5.4 0 0 0 0-7.7Z',
  'heart-filled': 'M20.8 5.6a5.4 5.4 0 0 0-7.7 0L12 6.7l-1.1-1.1a5.4 5.4 0 1 0-7.7 7.7L12 22l8.8-8.7a5.4 5.4 0 0 0 0-7.7Z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
  share: 'M8.6 13.5l6.8 4M15.4 6.5l-6.8 4M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  trash: 'M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6',
  close: 'M18 6 6 18M6 6l12 12',
  filter: 'M22 4H2l8 9.46V20l4-2v-4.54z',
  'chevron-down': 'm6 9 6 6 6-6',
  weight: 'M12 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8.5 7h7l2.2 12.2a1.5 1.5 0 0 1-1.5 1.8H7.8a1.5 1.5 0 0 1-1.5-1.8z',
  ruler: 'M15.5 3.5 3.5 15.5l5 5 12-12zM7 12l2 2M10 9l2 2M13 6l2 2',
  category: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  ability: 'M12 2 3 7v6c0 5 3.8 8 9 9 5.2-1 9-4 9-9V7z',
  pokeball: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h6M15 12h6M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z',
  male: 'M10.5 21a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11ZM14.5 9.5 21 3M15 3h6v6',
  female: 'M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 13v8M9 18h6',
  check: 'M20 6 9 17l-5-5',
}

const isFilled = computed(() => props.name === 'heart-filled')
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="isFilled ? 'currentColor' : 'none'"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="ICON_PATHS[name]" />
  </svg>
</template>

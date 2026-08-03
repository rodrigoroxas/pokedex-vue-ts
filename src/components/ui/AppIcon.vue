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

/**
 * El corazón (favoritos) usa la geometría exacta del diseño de Figma, que vive
 * en un lienzo 16×16 con trazo 1.5. El resto de íconos son 24×24 con trazo 2.
 */
const HEART_PATH =
  'M13.8933 3.07333C13.5528 2.73267 13.1485 2.46243 12.7036 2.27805C12.2586 2.09368 11.7817 1.99878 11.3 1.99878C10.8183 1.99878 10.3414 2.09368 9.89643 2.27805C9.45145 2.46243 9.04717 2.73267 8.70666 3.07333L8 3.78L7.29333 3.07333C6.60554 2.38553 5.67269 1.99914 4.7 1.99914C3.72731 1.99914 2.79446 2.38553 2.10666 3.07333C1.41887 3.76112 1.03247 4.69397 1.03247 5.66666C1.03247 6.63935 1.41887 7.5722 2.10666 8.26L2.81333 8.96666L8 14.1533L13.1867 8.96666L13.8933 8.26C14.234 7.91949 14.5042 7.51521 14.6886 7.07023C14.873 6.62526 14.9679 6.14832 14.9679 5.66666C14.9679 5.185 14.873 4.70807 14.6886 4.26309C14.5042 3.81812 14.234 3.41383 13.8933 3.07333Z'

/** Íconos "sólidos" del diseño: se pintan con relleno y sin trazo. */
const SOLID_ICONS = new Set<IconName>(['home'])

const ICON_PATHS: Record<IconName, string> = {
  // Casa rellena del diseño (Figma → house.svg); azul al estar activo.
  home: 'M20.9938 11.9844C20.9938 12.5469 20.525 12.9875 19.9938 12.9875H18.9938L19.0157 17.9937C19.0157 18.0781 19.0094 18.1625 19 18.2469V18.7531C19 19.4438 18.4407 20.0031 17.75 20.0031H17.25C17.2157 20.0031 17.1813 20.0031 17.1469 20C17.1032 20.0031 17.0594 20.0031 17.0157 20.0031L16 20H15.25C14.5594 20 14 19.4406 14 18.75V18V16C14 15.4469 13.5532 15 13 15H11C10.4469 15 10 15.4469 10 16V18V18.75C10 19.4406 9.44067 20 8.75005 20H8.00005H7.00317C6.9563 20 6.90942 19.9969 6.86255 19.9937C6.82505 19.9969 6.78755 20 6.75005 20H6.25005C5.55942 20 5.00005 19.4406 5.00005 18.75V15.25C5.00005 15.2219 5.00005 15.1906 5.00317 15.1625V12.9844H4.00317C3.44067 12.9844 3.00317 12.5469 3.00317 11.9812C3.00317 11.7 3.09692 11.45 3.31567 11.2312L11.325 4.25C11.5438 4.03125 11.7938 4 12.0125 4C12.2313 4 12.4813 4.0625 12.6688 4.21875L20.65 11.2344C20.9 11.4531 21.025 11.7031 20.9938 11.9844Z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z',
  heart: HEART_PATH,
  'heart-filled': HEART_PATH,
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

const isHeart = computed(() => props.name === 'heart' || props.name === 'heart-filled')
const isSolid = computed(() => SOLID_ICONS.has(props.name))
const fillColor = computed(() =>
  props.name === 'heart-filled' || isSolid.value ? 'currentColor' : 'none',
)
const strokeColor = computed(() => (isSolid.value ? 'none' : 'currentColor'))
const viewBox = computed(() => (isHeart.value ? '0 0 16 16' : '0 0 24 24'))
const strokeWidth = computed(() => (isHeart.value ? 1.5 : 2))
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="viewBox"
    :fill="fillColor"
    :stroke="strokeColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="ICON_PATHS[name]" />
  </svg>
</template>

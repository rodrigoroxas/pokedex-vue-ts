<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonTypeName } from '@/types/pokemon'
import { getTypeColor, getTypeLabel } from '@/utils/pokemonType'

const props = withDefaults(
  defineProps<{ type: PokemonTypeName; size?: 'sm' | 'md' }>(),
  { size: 'md' },
)

/**
 * Íconos de tipo (SVG del diseño de Figma) cargados con glob de Vite.
 * Cada archivo es un glifo blanco; se muestra sobre el círculo de la pastilla.
 */
const iconUrls = import.meta.glob('../../assets/images/types/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const TYPE_ICONS: Record<string, string> = Object.fromEntries(
  Object.entries(iconUrls).map(([path, url]) => [
    path.split('/').pop()!.replace('.svg', ''),
    url,
  ]),
)

const color = computed(() => getTypeColor(props.type))
const label = computed(() => getTypeLabel(props.type))
const icon = computed(() => TYPE_ICONS[props.type])
</script>

<template>
  <span class="badge" :class="`badge--${size}`" :style="{ backgroundColor: color }">
    <span class="badge__icon">
      <img v-if="icon" :src="icon" alt="" />
    </span>
    <span class="badge__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  border-radius: var(--radius-pill);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  white-space: nowrap;
}

.badge--md {
  padding: 5px 12px 5px 6px;
  font-size: var(--font-size-sm);
}

.badge--sm {
  padding: 3px 10px 3px 4px;
  font-size: var(--font-size-xs);
}

.badge__icon {
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  aspect-ratio: 1;
}

.badge--md .badge__icon {
  width: 18px;
  height: 18px;
}

.badge--sm .badge__icon {
  width: 15px;
  height: 15px;
}

.badge__icon img {
  width: 72%;
  height: 72%;
  object-fit: contain;
}

.badge__label {
  padding-right: 2px;
}
</style>

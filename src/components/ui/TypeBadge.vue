<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonTypeName } from '@/types/pokemon'
import { getTypeColor, getTypeIconSvg, getTypeLabel } from '@/utils/pokemonType'

const props = withDefaults(
  defineProps<{ type: PokemonTypeName; size?: 'sm' | 'md' }>(),
  { size: 'md' },
)

const color = computed(() => getTypeColor(props.type))
const label = computed(() => getTypeLabel(props.type))
// SVG inline teñido con el color del tipo (glifo coloreado sobre círculo blanco).
const iconSvg = computed(() => getTypeIconSvg(props.type))
</script>

<template>
  <span class="badge" :class="`badge--${size}`" :style="{ backgroundColor: color }">
    <span class="badge__icon" :style="{ color }">
      <span v-if="iconSvg" class="badge__glyph" v-html="iconSvg"></span>
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
  padding: 5px 12px 5px 5px;
  font-size: var(--font-size-sm);
}

.badge--sm {
  padding: 3px 10px 3px 4px;
  font-size: var(--font-size-xs);
}

/* Círculo blanco sólido (contrasta el glifo teñido con el color del tipo). */
.badge__icon {
  display: grid;
  place-items: center;
  background: #fff;
  border-radius: 50%;
  aspect-ratio: 1;
}

.badge--md .badge__icon {
  width: 20px;
  height: 20px;
}

.badge--sm .badge__icon {
  width: 16px;
  height: 16px;
}

/* Glifo del tipo: SVG inline teñido con currentColor (= color del tipo). */
.badge__glyph {
  display: grid;
  place-items: center;
  width: 76%;
  height: 76%;
}

.badge__glyph :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.badge__label {
  padding-right: 2px;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'

/** Clave de ícono de atributo (archivos en assets/images/stats). */
export type StatIcon = 'weight' | 'height' | 'category' | 'ability'

/**
 * Íconos de atributos tal cual el diseño (Figma → carpeta `iconos`): peso,
 * altura, categoría y habilidad. Se inyectan inline y heredan `currentColor`,
 * por lo que toman el color de la etiqueta.
 */
const STAT_ICONS_RAW = import.meta.glob('../../assets/images/stats/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const STAT_ICONS: Record<string, string> = Object.fromEntries(
  Object.entries(STAT_ICONS_RAW).map(([path, svg]) => [
    path.split('/').pop()!.replace('.svg', ''),
    svg,
  ]),
)

/** Caja etiquetada (peso, altura, categoría, habilidad) como en el diseño. */
const props = defineProps<{ label: string; value: string; icon?: StatIcon }>()

const iconSvg = computed(() => (props.icon ? (STAT_ICONS[props.icon] ?? '') : ''))
</script>

<template>
  <div class="stat-box">
    <span class="stat-box__label">
      <span v-if="iconSvg" class="stat-box__icon" v-html="iconSvg"></span>
      {{ label }}
    </span>
    <div class="stat-box__value">{{ value }}</div>
  </div>
</template>

<style scoped>
.stat-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.stat-box__label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.stat-box__icon {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.stat-box__icon :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.stat-box__value {
  padding: 12px var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  text-align: center;
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

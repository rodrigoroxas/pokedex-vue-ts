<script setup lang="ts">
import type { Pokemon } from '@/types/pokemon'

/** Barras de stats base. Se usa el color del tipo primario para la barra. */
defineProps<{ stats: Pokemon['stats']; color: string }>()

/** Valor máximo teórico de una stat base, para escalar las barras. */
const MAX_STAT = 200
</script>

<template>
  <ul class="stats">
    <li v-for="stat in stats" :key="stat.name" class="stats__row">
      <span class="stats__name">{{ stat.name }}</span>
      <span class="stats__value">{{ stat.value }}</span>
      <div class="stats__track">
        <div
          class="stats__fill"
          :style="{
            width: `${Math.min(100, (stat.value / MAX_STAT) * 100)}%`,
            backgroundColor: color,
          }"
        ></div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.stats__row {
  display: grid;
  grid-template-columns: 72px 32px 1fr;
  align-items: center;
  gap: var(--space-xs);
}

.stats__name {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.stats__value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-align: right;
}

.stats__track {
  height: 8px;
  border-radius: var(--radius-pill);
  background: var(--color-border);
  overflow: hidden;
}

.stats__fill {
  height: 100%;
  border-radius: var(--radius-pill);
  transition: width 0.4s ease;
}
</style>

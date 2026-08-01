<script setup lang="ts">
import AppIcon, { type IconName } from '@/components/ui/AppIcon.vue'

/** Caja etiquetada (peso, altura, categoría, habilidad) como en el diseño. */
defineProps<{ label: string; value: string; icon?: IconName }>()
</script>

<template>
  <div class="stat-box">
    <span class="stat-box__label">
      <AppIcon v-if="icon" :name="icon" :size="16" />
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

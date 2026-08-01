<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'

/** Distribución de género (macho/hembra) como en el diseño del detalle. */
defineProps<{ gender: { male: number; female: number } }>()
</script>

<template>
  <div class="gender">
    <span class="gender__title">Género</span>

    <div class="gender__bar">
      <span class="gender__fill gender__fill--male" :style="{ width: `${gender.male}%` }"></span>
      <span
        class="gender__fill gender__fill--female"
        :style="{ width: `${gender.female}%` }"
      ></span>
    </div>

    <div class="gender__legend">
      <span class="gender__value gender__value--male">
        <AppIcon name="male" :size="16" />
        {{ gender.male }}%
      </span>
      <span class="gender__value gender__value--female">
        <AppIcon name="female" :size="16" />
        {{ gender.female }}%
      </span>
    </div>
  </div>
</template>

<style scoped>
.gender {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.gender__title {
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.gender__bar {
  display: flex;
  height: 8px;
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.gender__fill--male {
  background: var(--color-primary-strong);
}

.gender__fill--female {
  background: var(--type-fairy);
}

.gender__legend {
  display: flex;
  justify-content: space-between;
}

.gender__value {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.gender__value--male {
  color: var(--color-primary-strong);
}

.gender__value--female {
  color: var(--type-fairy);
}
</style>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'

/** Diálogo de confirmación reutilizable para acciones destructivas. */
withDefaults(
  defineProps<{
    title: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
  }>(),
  { message: '', confirmLabel: 'Eliminar', cancelLabel: 'Cancelar' },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <div class="confirm-overlay" @click.self="emit('cancel')">
    <section class="confirm" role="alertdialog" aria-modal="true" :aria-label="title">
      <h2 class="confirm__title">{{ title }}</h2>
      <p v-if="message" class="confirm__message">{{ message }}</p>
      <div class="confirm__actions">
        <BaseButton block variant="danger" @click="emit('confirm')">{{ confirmLabel }}</BaseButton>
        <BaseButton block variant="secondary" @click="emit('cancel')">{{ cancelLabel }}</BaseButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-sheet);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  background: rgba(18, 18, 18, 0.5);
}

.confirm {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  text-align: center;
}

.confirm__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.confirm__message {
  color: var(--color-text-secondary);
}

.confirm__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}
</style>

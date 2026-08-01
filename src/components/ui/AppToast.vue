<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import AppIcon from '@/components/ui/AppIcon.vue'

const toast = useToastStore()
</script>

<template>
  <Transition name="toast">
    <div v-if="toast.visible" class="toast" role="status" aria-live="polite">
      <AppIcon name="check" :size="18" />
      <span>{{ toast.message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: calc(var(--tabbar-height) + var(--space-md));
  transform: translateX(-50%);
  z-index: 60;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  max-width: 90%;
  padding: 12px 20px;
  background: var(--color-text-primary);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-pill);
  box-shadow: 0 6px 20px rgba(18, 18, 18, 0.25);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}

@media (min-width: 768px) {
  .toast {
    bottom: var(--space-lg);
  }
}
</style>

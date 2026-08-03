<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger'
    block?: boolean
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', block: false, type: 'button' },
)
</script>

<template>
  <button :type="type" class="btn" :class="[`btn--${variant}`, { 'btn--block': block }]">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: 16px var(--space-lg);
  /* El diseño usa botones tipo pill (rx=24 sobre alto 48). */
  border-radius: var(--radius-pill);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  transition:
    transform 0.05s ease,
    filter 0.15s ease,
    background-color 0.15s ease;
}

.btn:active {
  transform: scale(0.98);
}

.btn--block {
  width: 100%;
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.btn--primary:hover {
  filter: brightness(1.08);
}

.btn--secondary {
  background-color: #ededed;
  color: var(--color-text-primary);
}

.btn--secondary:hover {
  background-color: #e3e3e3;
}

.btn--danger {
  background-color: var(--color-danger);
  color: var(--color-text-inverse);
}

.btn--danger:hover {
  filter: brightness(1.08);
}
</style>

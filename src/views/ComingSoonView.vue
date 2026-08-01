<script setup lang="ts">
import EmptyState from '@/components/ui/EmptyState.vue'
</script>

<template>
  <div class="coming-soon">
    <EmptyState
      title="¡Muy pronto disponible!"
      description="Estamos trabajando para traerte esta sección. Vuelve más adelante para descubrir todas las novedades."
    />
  </div>
</template>

<style scoped>
.coming-soon {
  display: grid;
  place-items: center;
  min-height: 70vh;
  padding: var(--space-md);
}
</style>

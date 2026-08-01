<script setup lang="ts">
import PokeballLoader from '@/components/ui/PokeballLoader.vue'
</script>

<template>
  <div class="splash">
    <PokeballLoader :size="150" spin label="" />
  </div>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  background: var(--color-surface);
}
</style>

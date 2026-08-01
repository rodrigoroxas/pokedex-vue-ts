<script setup lang="ts">
/**
 * Estado ilustrado reutilizable para "sin favoritos", "error" y "muy pronto".
 * La ilustración es el Magikarp del diseño, en escala de grises vía CSS.
 */
withDefaults(defineProps<{ title: string; description?: string }>(), { description: '' })

// Artwork oficial de Magikarp (id 129) servido por PokéAPI.
const MAGIKARP_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png'
</script>

<template>
  <div class="empty">
    <img class="empty__art" :src="MAGIKARP_URL" alt="" />
    <h2 class="empty__title">{{ title }}</h2>
    <p v-if="description" class="empty__desc">{{ description }}</p>
    <div v-if="$slots.action" class="empty__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-lg);
  gap: var(--space-xs);
}

.empty__art {
  width: 180px;
  height: 180px;
  object-fit: contain;
  filter: grayscale(1) opacity(0.35);
}

.empty__title {
  margin-top: var(--space-md);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.empty__desc {
  max-width: 320px;
  color: var(--color-text-secondary);
}

.empty__action {
  margin-top: var(--space-lg);
  width: 100%;
  max-width: 328px;
}
</style>

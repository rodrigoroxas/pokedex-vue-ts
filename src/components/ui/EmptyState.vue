<script setup lang="ts">
import { computed } from 'vue'

/**
 * Estado ilustrado reutilizable para "sin favoritos", "error" y "muy pronto".
 * La ilustración (un Pokémon del diseño) se muestra en escala de grises vía
 * CSS. Por defecto es Magikarp (id 129); se puede cambiar con `artworkId`
 * para respetar el diseño (p.ej. Jigglypuff, id 39, en la pantalla "muy pronto").
 */
const props = withDefaults(
  defineProps<{ title: string; description?: string; artworkId?: number }>(),
  { description: '', artworkId: 129 },
)

const artworkUrl = computed(
  () =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${props.artworkId}.png`,
)
</script>

<template>
  <div class="empty">
    <img class="empty__art" :src="artworkUrl" alt="" />
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

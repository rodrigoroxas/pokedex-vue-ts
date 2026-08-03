<script setup lang="ts">
import { computed } from 'vue'

/**
 * Estado ilustrado reutilizable para "sin favoritos", "error" y "muy pronto".
 * Usa las ilustraciones del diseño (Figma), ya en escala de grises. Por defecto
 * es Magikarp; en la pantalla "muy pronto" se usa Jigglypuff (`art="jigglypuff"`).
 */
type StateArt = 'magikarp' | 'jigglypuff'

const props = withDefaults(
  defineProps<{ title: string; description?: string; art?: StateArt }>(),
  { description: '', art: 'magikarp' },
)

const STATE_ART = import.meta.glob('../../assets/images/states/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const artUrls: Record<StateArt, string> = Object.fromEntries(
  Object.entries(STATE_ART).map(([path, url]) => [
    path.split('/').pop()!.replace('.svg', ''),
    url,
  ]),
) as Record<StateArt, string>

const artworkUrl = computed(() => artUrls[props.art])
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

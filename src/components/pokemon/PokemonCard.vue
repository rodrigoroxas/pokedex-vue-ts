<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Pokemon } from '@/types/pokemon'
import { usePokemonStore } from '@/stores/pokemon'
import { useFavoritesStore } from '@/stores/favorites'
import { getTypeColor } from '@/utils/pokemonType'
import { capitalize, formatPokedexNumber } from '@/utils/format'
import TypeBadge from '@/components/ui/TypeBadge.vue'
import FavoriteButton from '@/components/pokemon/FavoriteButton.vue'

/**
 * Card de un Pokémon. Puede recibir un Pokémon ya cargado (`preloaded`, p.ej.
 * desde favoritos) o solo el `name`, en cuyo caso carga su detalle de forma
 * perezosa desde el store. Mientras llega el dato muestra un skeleton.
 */
const props = defineProps<{ name: string; preloaded?: Pokemon }>()
const emit = defineEmits<{ select: [pokemon: Pokemon] }>()

const store = usePokemonStore()
const favorites = useFavoritesStore()

const pokemon = ref<Pokemon | null>(props.preloaded ?? store.getCached(props.name) ?? null)

onMounted(async () => {
  if (!pokemon.value) {
    try {
      pokemon.value = await store.loadDetail(props.name)
    } catch {
      /* Si un detalle puntual falla, la card queda como skeleton silencioso. */
    }
  }
})

const primaryColor = computed(() =>
  pokemon.value ? getTypeColor(pokemon.value.types[0] ?? 'normal') : 'var(--type-normal)',
)
</script>

<template>
  <article
    v-if="pokemon"
    class="card"
    :style="{ '--type-color': primaryColor }"
    role="button"
    tabindex="0"
    @click="emit('select', pokemon)"
    @keydown.enter="emit('select', pokemon)"
  >
    <div class="card__info">
      <span class="card__number">{{ formatPokedexNumber(pokemon.id) }}</span>
      <h3 class="card__name">{{ capitalize(pokemon.name) }}</h3>
      <div class="card__types">
        <TypeBadge v-for="type in pokemon.types" :key="type" :type="type" size="sm" />
      </div>
    </div>

    <div class="card__media">
      <span class="card__ball" aria-hidden="true"></span>
      <img
        class="card__sprite"
        :src="pokemon.spriteUrl"
        :alt="capitalize(pokemon.name)"
        loading="lazy"
      />
      <FavoriteButton
        class="card__fav"
        :active="favorites.isFavorite(pokemon.id)"
        @toggle="favorites.toggle(pokemon)"
      />
    </div>
  </article>

  <div v-else class="card card--skeleton" aria-hidden="true">
    <div class="skeleton-line skeleton-line--sm"></div>
    <div class="skeleton-line skeleton-line--lg"></div>
    <div class="skeleton-line skeleton-line--md"></div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 104px;
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  /* Tinte claro del color de tipo como fondo de la card. */
  background: color-mix(in srgb, var(--type-color) 22%, white);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

.card__info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1;
}

.card__number {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: color-mix(in srgb, var(--type-color) 70%, black);
}

.card__name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: 1.1;
}

.card__types {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.card__media {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 42%;
  display: grid;
  place-items: center;
  /* Gradiente más intenso del color del tipo en la zona del sprite. */
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--type-color) 55%, white),
    var(--type-color)
  );
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

/* Silueta de pokebola como marca de agua detrás del sprite. */
.card__ball {
  position: absolute;
  right: -18px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 20px solid rgba(255, 255, 255, 0.18);
}

.card__ball::after {
  content: '';
  position: absolute;
  inset: 40% -20px auto -20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.18);
}

.card__sprite {
  position: relative;
  width: 92px;
  height: 92px;
  object-fit: contain;
  image-rendering: pixelated;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
  z-index: 1;
}

.card__fav {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

/* ---- Skeleton ---- */
.card--skeleton {
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--space-xs);
  background: #eceef1;
  cursor: default;
}

.skeleton-line {
  height: 14px;
  border-radius: var(--radius-sm);
  background: linear-gradient(90deg, #e0e2e6 25%, #eef0f3 50%, #e0e2e6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite;
}

.skeleton-line--sm {
  width: 40px;
}
.skeleton-line--lg {
  width: 140px;
  height: 22px;
}
.skeleton-line--md {
  width: 90px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

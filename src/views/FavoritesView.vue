<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { Pokemon } from '@/types/pokemon'
import { useFavoritesStore } from '@/stores/favorites'
import PokemonCard from '@/components/pokemon/PokemonCard.vue'
import PokemonDetail from '@/components/pokemon/PokemonDetail.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const favoritesStore = useFavoritesStore()
const { favorites, isEmpty } = storeToRefs(favoritesStore)

const selected = ref<Pokemon | null>(null)
</script>

<template>
  <div class="favorites">
    <header class="favorites__header">
      <h1 class="favorites__title">Favoritos</h1>
      <p class="favorites__subtitle">
        {{ isEmpty ? 'Aún no tienes Pokémon favoritos.' : `${favorites.length} Pokémon guardados.` }}
      </p>
    </header>

    <EmptyState
      v-if="isEmpty"
      title="No has marcado ningún Pokémon como favorito"
      description="Haz clic en el ícono de corazón de tus Pokémon favoritos y aparecerán aquí."
    />

    <ul v-else class="favorites__grid">
      <li v-for="pokemon in favorites" :key="pokemon.id">
        <PokemonCard :name="pokemon.name" :preloaded="pokemon" @select="selected = $event" />
      </li>
    </ul>

    <Transition name="sheet">
      <PokemonDetail v-if="selected" :pokemon="selected" @close="selected = null" />
    </Transition>
  </div>
</template>

<style scoped>
.favorites {
  padding: var(--space-md);
}

.favorites__header {
  padding: var(--space-xs) 0 var(--space-md);
  text-align: center;
}

.favorites__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.favorites__subtitle {
  display: none;
  color: var(--color-text-secondary);
}

.favorites__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-sm);
}

/* ---- Layout web/desktop ---- */
@media (min-width: 768px) {
  .favorites {
    padding: var(--space-xl) var(--space-lg);
  }

  .favorites__header {
    text-align: left;
    padding-bottom: var(--space-lg);
  }

  .favorites__title {
    font-size: var(--font-size-2xl);
  }

  .favorites__subtitle {
    display: block;
  }

  .favorites__grid {
    gap: var(--space-md);
  }
}

/* Reutiliza la transición del sheet (definida a nivel de la vista Pokédex). */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active :deep(.sheet),
.sheet-leave-active :deep(.sheet) {
  transition: transform 0.3s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from :deep(.sheet),
.sheet-leave-to :deep(.sheet) {
  transform: translateY(100%);
}
</style>

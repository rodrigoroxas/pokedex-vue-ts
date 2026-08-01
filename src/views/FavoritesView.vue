<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { Pokemon, PokemonTypeName } from '@/types/pokemon'
import { useFavoritesStore } from '@/stores/favorites'
import { useFavoriteToggle } from '@/composables/useFavoriteToggle'
import { filterPokemonList } from '@/utils/search'
import AppSearchBar from '@/components/layout/AppSearchBar.vue'
import FilterSheet from '@/components/layout/FilterSheet.vue'
import PokemonCard from '@/components/pokemon/PokemonCard.vue'
import PokemonDetail from '@/components/pokemon/PokemonDetail.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import SwipeToDelete from '@/components/ui/SwipeToDelete.vue'

const favoritesStore = useFavoritesStore()
const { favorites, isEmpty } = storeToRefs(favoritesStore)
// Reutiliza el toggle con confirmación: el basurero pide confirmar al quitar.
const { toggleFavorite } = useFavoriteToggle()

const searchQuery = ref('')
const appliedTypes = ref<PokemonTypeName[]>([])
const showFilter = ref(false)
const selected = ref<Pokemon | null>(null)

// Los favoritos ya tienen los datos completos → se filtran en memoria.
const filtered = computed(() =>
  filterPokemonList(favorites.value, searchQuery.value, appliedTypes.value),
)

const hasActiveFilter = computed(
  () => searchQuery.value.trim() !== '' || appliedTypes.value.length > 0,
)

function onApplyFilter(types: PokemonTypeName[]) {
  appliedTypes.value = types
  showFilter.value = false
}

function clearFilters() {
  searchQuery.value = ''
  appliedTypes.value = []
}
</script>

<template>
  <div class="favorites">
    <header class="favorites__header">
      <h1 class="favorites__title">Favoritos</h1>
      <p class="favorites__subtitle">
        {{ isEmpty ? 'Aún no tienes Pokémon favoritos.' : `${favorites.length} Pokémon guardados.` }}
      </p>
    </header>

    <!-- Sin favoritos en absoluto -->
    <EmptyState
      v-if="isEmpty"
      title="No has marcado ningún Pokémon como favorito"
      description="Haz clic en el ícono de corazón de tus Pokémon favoritos y aparecerán aquí."
    />

    <template v-else>
      <!-- Buscador + filtro (mismos controles que la Pokédex) -->
      <div class="favorites__toolbar">
        <AppSearchBar v-model="searchQuery" class="favorites__search" />
        <button
          class="favorites__filter"
          :class="{ 'favorites__filter--active': appliedTypes.length }"
          type="button"
          aria-label="Filtrar por tipo"
          @click="showFilter = true"
        >
          <AppIcon name="filter" :size="20" />
          <span v-if="appliedTypes.length" class="favorites__filter-badge">
            {{ appliedTypes.length }}
          </span>
        </button>
      </div>

      <div v-if="hasActiveFilter" class="favorites__results">
        <span>Se han encontrado {{ filtered.length }} resultados</span>
        <button class="favorites__clear" type="button" @click="clearFilters">Borrar filtro</button>
      </div>

      <!-- Filtro sin coincidencias -->
      <EmptyState
        v-if="filtered.length === 0"
        title="Sin resultados"
        description="Ninguno de tus favoritos coincide con esos criterios. Prueba con otro nombre, número o tipo."
      />

      <ul v-else class="favorites__grid">
        <li v-for="pokemon in filtered" :key="pokemon.id">
          <SwipeToDelete @delete="toggleFavorite(pokemon)">
            <PokemonCard :name="pokemon.name" :preloaded="pokemon" @select="selected = $event" />
          </SwipeToDelete>
        </li>
      </ul>
    </template>

    <!-- Hoja de filtro por tipo -->
    <Transition name="sheet">
      <FilterSheet
        v-if="showFilter"
        :applied="appliedTypes"
        @apply="onApplyFilter"
        @close="showFilter = false"
      />
    </Transition>

    <!-- Detalle en bottom sheet -->
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

.favorites__toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.favorites__search {
  flex: 1;
}

.favorites__filter {
  position: relative;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface-raised);
  color: var(--color-text-secondary);
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.favorites__filter:hover {
  color: var(--color-text-primary);
}

.favorites__filter--active {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.favorites__filter-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  display: grid;
  place-items: center;
  background: var(--color-primary);
  color: #fff;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-pill);
}

.favorites__results {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

.favorites__clear {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
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

/* Transición del bottom sheet */
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

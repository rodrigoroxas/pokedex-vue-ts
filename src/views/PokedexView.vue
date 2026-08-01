<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Pokemon, PokemonTypeName } from '@/types/pokemon'
import { usePokedexList } from '@/composables/usePokedexList'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import AppSearchBar from '@/components/layout/AppSearchBar.vue'
import FilterSheet from '@/components/layout/FilterSheet.vue'
import PokemonCard from '@/components/pokemon/PokemonCard.vue'
import PokemonDetail from '@/components/pokemon/PokemonDetail.vue'
import PokeballLoader from '@/components/ui/PokeballLoader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const {
  searchQuery,
  indexStatus,
  filterStatus,
  appliedTypes,
  visibleItems,
  hasMore,
  resultCount,
  hasActiveFilter,
  loadMore,
  applyTypeFilter,
  clearFilters,
  loadIndex,
} = usePokedexList()

const { sentinel } = useInfiniteScroll(loadMore)

const selected = ref<Pokemon | null>(null)
const showFilter = ref(false)

function onApplyFilter(types: PokemonTypeName[]) {
  applyTypeFilter(types)
  showFilter.value = false
}

onMounted(loadIndex)
</script>

<template>
  <div class="pokedex">
    <!-- Pantalla de carga con la pokebola animada -->
    <div v-if="indexStatus === 'loading' || indexStatus === 'idle'" class="pokedex__center">
      <PokeballLoader :size="120" label="Cargando Pokédex..." />
    </div>

    <!-- Estado de error al cargar el índice -->
    <div v-else-if="indexStatus === 'error'" class="pokedex__center">
      <EmptyState
        title="Algo salió mal..."
        description="No pudimos cargar la información en este momento. Verifica tu conexión o intenta nuevamente más tarde."
      >
        <template #action>
          <BaseButton block @click="loadIndex">Reintentar</BaseButton>
        </template>
      </EmptyState>
    </div>

    <!-- Contenido -->
    <template v-else>
      <header class="pokedex__header">
        <div class="pokedex__bar">
          <div class="pokedex__heading">
            <h1 class="pokedex__title">Pokédex</h1>
            <p class="pokedex__subtitle">Explora todos los Pokémon y guarda tus favoritos.</p>
          </div>
          <div class="pokedex__searchrow">
            <AppSearchBar v-model="searchQuery" class="pokedex__search" />
            <button
              class="pokedex__filter"
              :class="{ 'pokedex__filter--active': appliedTypes.length }"
              type="button"
              aria-label="Filtrar por tipo"
              @click="showFilter = true"
            >
              <AppIcon name="filter" :size="20" />
              <span v-if="appliedTypes.length" class="pokedex__filter-badge">
                {{ appliedTypes.length }}
              </span>
            </button>
          </div>
        </div>

        <div v-if="hasActiveFilter" class="pokedex__results">
          <span>Se han encontrado {{ resultCount }} resultados</span>
          <button class="pokedex__clear" type="button" @click="clearFilters">Borrar filtro</button>
        </div>
      </header>

      <!-- Cargando el filtro por tipo -->
      <div v-if="filterStatus === 'loading'" class="pokedex__center">
        <PokeballLoader :size="72" label="Aplicando filtro..." />
      </div>

      <EmptyState
        v-else-if="resultCount === 0"
        title="Sin resultados"
        description="No encontramos Pokémon con esos criterios. Prueba con otro nombre, número o tipo."
      />

      <ul v-else class="pokedex__grid">
        <li v-for="item in visibleItems" :key="item.name">
          <PokemonCard :name="item.name" @select="selected = $event" />
        </li>
      </ul>

      <!-- Centinela de infinite scroll -->
      <div v-if="hasMore && filterStatus !== 'loading'" ref="sentinel" class="pokedex__sentinel">
        <PokeballLoader :size="48" label="" />
      </div>
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
.pokedex {
  padding: var(--space-md);
}

.pokedex__center {
  display: grid;
  place-items: center;
  min-height: 60vh;
}

.pokedex__header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding-bottom: var(--space-md);
  background: #eef1f5;
}

.pokedex__heading {
  display: none;
}

.pokedex__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.pokedex__subtitle {
  color: var(--color-text-secondary);
}

.pokedex__searchrow {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.pokedex__search {
  flex: 1;
}

.pokedex__filter {
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

.pokedex__filter:hover {
  color: var(--color-text-primary);
}

.pokedex__filter--active {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.pokedex__filter-badge {
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

.pokedex__results {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
}

.pokedex__clear {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.pokedex__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-sm);
}

.pokedex__sentinel {
  display: grid;
  place-items: center;
  padding: var(--space-lg);
}

/* ---- Layout web/desktop ---- */
@media (min-width: 768px) {
  .pokedex {
    padding: var(--space-xl) var(--space-lg);
  }

  .pokedex__header {
    position: static;
    gap: var(--space-md);
    padding-bottom: var(--space-lg);
  }

  .pokedex__bar {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-lg);
  }

  .pokedex__heading {
    display: block;
  }

  .pokedex__search {
    width: 360px;
    flex: none;
  }

  .pokedex__grid {
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

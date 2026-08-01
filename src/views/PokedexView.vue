<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Pokemon } from '@/types/pokemon'
import { usePokedexList } from '@/composables/usePokedexList'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import AppSearchBar from '@/components/layout/AppSearchBar.vue'
import PokemonCard from '@/components/pokemon/PokemonCard.vue'
import PokemonDetail from '@/components/pokemon/PokemonDetail.vue'
import PokeballLoader from '@/components/ui/PokeballLoader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const {
  searchQuery,
  indexStatus,
  visibleItems,
  hasMore,
  resultCount,
  loadMore,
  clearSearch,
  loadIndex,
} = usePokedexList()

const { sentinel } = useInfiniteScroll(loadMore)

const selected = ref<Pokemon | null>(null)

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
        <AppSearchBar v-model="searchQuery" />
        <div v-if="searchQuery" class="pokedex__results">
          <span>Se han encontrado {{ resultCount }} resultados</span>
          <button class="pokedex__clear" type="button" @click="clearSearch">Borrar filtro</button>
        </div>
      </header>

      <EmptyState
        v-if="resultCount === 0"
        title="Sin resultados"
        description="No encontramos ningún Pokémon con ese nombre. Prueba con otro término."
      />

      <ul v-else class="pokedex__grid">
        <li v-for="item in visibleItems" :key="item.name">
          <PokemonCard :name="item.name" @select="selected = $event" />
        </li>
      </ul>

      <!-- Centinela de infinite scroll -->
      <div v-if="hasMore" ref="sentinel" class="pokedex__sentinel">
        <PokeballLoader :size="48" label="" />
      </div>
    </template>

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
  min-height: 70vh;
}

.pokedex__header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding-bottom: var(--space-md);
  background: var(--color-surface);
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-sm);
}

.pokedex__sentinel {
  display: grid;
  place-items: center;
  padding: var(--space-lg);
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

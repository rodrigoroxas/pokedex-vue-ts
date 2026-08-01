import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Pokemon } from '@/types/pokemon'
import { readJson, writeJson } from '@/utils/storage'

const STORAGE_KEY = 'global66-pokedex:favorites'

/**
 * Store de favoritos.
 *
 * El store de Pinia es la fuente de verdad (como pide la prueba). Además se
 * hidrata desde y se sincroniza hacia localStorage, de modo que la lista de
 * favoritos sobreviva a recargas sin necesidad de backend.
 *
 * Se guarda el Pokémon completo (no solo el id) para que la vista de
 * favoritos se renderice al instante tras recargar, sin re-pedir el detalle.
 */
export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Pokemon[]>(readJson<Pokemon[]>(STORAGE_KEY, []))

  // Índice de ids para consultas O(1) de pertenencia.
  const favoriteIds = computed(() => new Set(favorites.value.map((p) => p.id)))
  const count = computed(() => favorites.value.length)
  const isEmpty = computed(() => favorites.value.length === 0)

  function isFavorite(id: number): boolean {
    return favoriteIds.value.has(id)
  }

  function add(pokemon: Pokemon): void {
    if (!isFavorite(pokemon.id)) favorites.value.push(pokemon)
  }

  function remove(id: number): void {
    favorites.value = favorites.value.filter((p) => p.id !== id)
  }

  /** Alterna el estado de favorito; devuelve el nuevo estado. */
  function toggle(pokemon: Pokemon): boolean {
    if (isFavorite(pokemon.id)) {
      remove(pokemon.id)
      return false
    }
    add(pokemon)
    return true
  }

  // Persistencia reactiva: cualquier cambio se refleja en localStorage.
  watch(favorites, (value) => writeJson(STORAGE_KEY, value), { deep: true })

  return { favorites, favoriteIds, count, isEmpty, isFavorite, add, remove, toggle }
})

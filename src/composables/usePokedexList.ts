import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePokemonStore } from '@/stores/pokemon'

const PAGE_SIZE = 30

/**
 * Orquesta la lista de la Pokédex: búsqueda por nombre y paginación en
 * cliente sobre el índice completo. Devuelve solo la "ventana" visible de
 * nombres; cada card carga su propio detalle de forma perezosa.
 *
 * Filtrar y paginar en cliente es viable porque el índice (name + url) es
 * liviano; lo pesado —el detalle— se difiere.
 */
export function usePokedexList() {
  const store = usePokemonStore()
  const { index, indexStatus } = storeToRefs(store)

  const searchQuery = ref('')
  const visibleCount = ref(PAGE_SIZE)

  const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())

  const filteredIndex = computed(() => {
    if (!normalizedQuery.value) return index.value
    return index.value.filter((item) => item.name.includes(normalizedQuery.value))
  })

  const visibleItems = computed(() => filteredIndex.value.slice(0, visibleCount.value))
  const hasMore = computed(() => visibleCount.value < filteredIndex.value.length)
  const resultCount = computed(() => filteredIndex.value.length)

  function loadMore(): void {
    if (hasMore.value) visibleCount.value += PAGE_SIZE
  }

  function clearSearch(): void {
    searchQuery.value = ''
  }

  // Al cambiar la búsqueda, se reinicia la paginación desde arriba.
  watch(normalizedQuery, () => {
    visibleCount.value = PAGE_SIZE
  })

  return {
    searchQuery,
    indexStatus,
    filteredIndex,
    visibleItems,
    hasMore,
    resultCount,
    loadMore,
    clearSearch,
    loadIndex: store.loadIndex,
  }
}

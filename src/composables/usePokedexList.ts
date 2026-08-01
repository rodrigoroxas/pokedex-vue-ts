import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { PokemonTypeName, RequestStatus } from '@/types/pokemon'
import { usePokemonStore } from '@/stores/pokemon'
import { extractIdFromUrl } from '@/utils/format'
import { pokemonMatchesQuery } from '@/utils/search'

const PAGE_SIZE = 30

/**
 * Orquesta la lista de la Pokédex: búsqueda por nombre/número, filtro por
 * tipo y paginación en cliente sobre el índice completo. Devuelve solo la
 * "ventana" visible de nombres; cada card carga su propio detalle (lazy).
 *
 * Filtrar y paginar en cliente es viable porque el índice (name + url) es
 * liviano; lo pesado —el detalle— se difiere. El filtro por tipo resuelve el
 * conjunto de nombres con /type (cacheado en el store) y se intersecta con
 * el índice.
 */
export function usePokedexList() {
  const store = usePokemonStore()
  const { index, indexStatus } = storeToRefs(store)

  const searchQuery = ref('')
  const visibleCount = ref(PAGE_SIZE)

  // Filtro por tipo: tipos aplicados y el conjunto de nombres permitidos.
  const appliedTypes = ref<PokemonTypeName[]>([])
  const allowedNames = ref<Set<string> | null>(null)
  const filterStatus = ref<RequestStatus>('idle')

  const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())

  const filteredIndex = computed(() => {
    let items = index.value

    // 1) Filtro por tipo (unión de los tipos seleccionados).
    if (allowedNames.value) {
      const allowed = allowedNames.value
      items = items.filter((item) => allowed.has(item.name))
    }

    // 2) Búsqueda por nombre o número.
    if (normalizedQuery.value) {
      items = items.filter((item) =>
        pokemonMatchesQuery(item.name, extractIdFromUrl(item.url), normalizedQuery.value),
      )
    }

    return items
  })

  const visibleItems = computed(() => filteredIndex.value.slice(0, visibleCount.value))
  const hasMore = computed(() => visibleCount.value < filteredIndex.value.length)
  const resultCount = computed(() => filteredIndex.value.length)
  const hasActiveFilter = computed(
    () => appliedTypes.value.length > 0 || normalizedQuery.value !== '',
  )

  function loadMore(): void {
    if (hasMore.value) visibleCount.value += PAGE_SIZE
  }

  /** Aplica el filtro por tipo; resuelve la unión de nombres vía /type. */
  async function applyTypeFilter(types: PokemonTypeName[]): Promise<void> {
    appliedTypes.value = [...types]
    if (types.length === 0) {
      allowedNames.value = null
      return
    }
    filterStatus.value = 'loading'
    try {
      const lists = await Promise.all(types.map((type) => store.loadNamesByType(type)))
      allowedNames.value = new Set(lists.flat())
      filterStatus.value = 'success'
    } catch {
      filterStatus.value = 'error'
      allowedNames.value = null
    }
  }

  /** Borra búsqueda y filtro por tipo. */
  function clearFilters(): void {
    searchQuery.value = ''
    appliedTypes.value = []
    allowedNames.value = null
  }

  // Al cambiar la búsqueda o el filtro, se reinicia la paginación desde arriba.
  watch([normalizedQuery, allowedNames], () => {
    visibleCount.value = PAGE_SIZE
  })

  return {
    searchQuery,
    indexStatus,
    filterStatus,
    appliedTypes,
    filteredIndex,
    visibleItems,
    hasMore,
    resultCount,
    hasActiveFilter,
    loadMore,
    applyTypeFilter,
    clearFilters,
    loadIndex: store.loadIndex,
  }
}

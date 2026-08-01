import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { NamedApiResource, Pokemon, RequestStatus, SpeciesInfo } from '@/types/pokemon'
import {
  fetchAbilityName,
  fetchPokemonByName,
  fetchPokemonIndex,
  fetchPokemonNamesByType,
  fetchSpecies,
} from '@/services/pokemonApi'

/**
 * Store de datos de Pokémon: mantiene el índice de nombres y una caché de
 * detalles ya cargados. Actúa como capa de caché para no re-pedir a la API
 * un Pokémon que ya se trajo (clave para el rendimiento con mucha data).
 */
export const usePokemonStore = defineStore('pokemon', () => {
  const index = ref<NamedApiResource[]>([])
  const indexStatus = ref<RequestStatus>('idle')

  const detailCache = ref(new Map<string, Pokemon>())
  // Peticiones de detalle en vuelo, para deduplicar cargas concurrentes.
  const pendingDetails = new Map<string, Promise<Pokemon>>()

  // Caché de nombres por tipo (para el filtro), un fetch por tipo como máximo.
  const typeNamesCache = new Map<string, string[]>()

  // Caché de datos de especie (categoría/descripción/género) por url.
  const speciesCache = new Map<string, SpeciesInfo>()

  // Caché del nombre localizado de cada habilidad.
  const abilityNameCache = new Map<string, string>()

  /** Carga el índice completo de nombres una sola vez. */
  async function loadIndex(): Promise<void> {
    if (indexStatus.value === 'loading' || index.value.length > 0) return
    indexStatus.value = 'loading'
    try {
      index.value = await fetchPokemonIndex()
      indexStatus.value = 'success'
    } catch {
      indexStatus.value = 'error'
    }
  }

  /**
   * Devuelve el detalle de un Pokémon usando la caché. Si hay una petición
   * idéntica en curso, la reutiliza en lugar de lanzar otra (deduplicación).
   */
  function loadDetail(name: string): Promise<Pokemon> {
    const cached = detailCache.value.get(name)
    if (cached) return Promise.resolve(cached)

    const inFlight = pendingDetails.get(name)
    if (inFlight) return inFlight

    const request = fetchPokemonByName(name)
      .then((pokemon) => {
        detailCache.value.set(name, pokemon)
        return pokemon
      })
      .finally(() => pendingDetails.delete(name))

    pendingDetails.set(name, request)
    return request
  }

  function getCached(name: string): Pokemon | undefined {
    return detailCache.value.get(name)
  }

  /** Devuelve (cacheados) los nombres de los Pokémon de un tipo. */
  async function loadNamesByType(type: string): Promise<string[]> {
    const cached = typeNamesCache.get(type)
    if (cached) return cached
    const names = await fetchPokemonNamesByType(type)
    typeNamesCache.set(type, names)
    return names
  }

  /** Devuelve (cacheados) los datos de especie de un Pokémon. */
  async function loadSpecies(speciesUrl: string): Promise<SpeciesInfo> {
    const cached = speciesCache.get(speciesUrl)
    if (cached) return cached
    const info = await fetchSpecies(speciesUrl)
    speciesCache.set(speciesUrl, info)
    return info
  }

  /** Devuelve (cacheado) el nombre localizado de una habilidad. */
  async function loadAbilityName(slug: string): Promise<string> {
    const cached = abilityNameCache.get(slug)
    if (cached) return cached
    const name = await fetchAbilityName(slug)
    abilityNameCache.set(slug, name)
    return name
  }

  return {
    index,
    indexStatus,
    detailCache,
    loadIndex,
    loadDetail,
    getCached,
    loadNamesByType,
    loadSpecies,
    loadAbilityName,
  }
})

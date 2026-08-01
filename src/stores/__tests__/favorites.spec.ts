import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFavoritesStore } from '@/stores/favorites'
import type { Pokemon } from '@/types/pokemon'

function makePokemon(id: number, name: string): Pokemon {
  return {
    id,
    name,
    types: ['normal'],
    heightMeters: 1,
    weightKg: 1,
    abilities: [],
    stats: [],
    spriteUrl: '',
    artworkUrl: '',
    weaknesses: [],
  }
}

describe('useFavoritesStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('empieza vacío', () => {
    const store = useFavoritesStore()
    expect(store.isEmpty).toBe(true)
    expect(store.count).toBe(0)
  })

  it('alterna un Pokémon como favorito', () => {
    const store = useFavoritesStore()
    const pikachu = makePokemon(25, 'pikachu')

    expect(store.toggle(pikachu)).toBe(true)
    expect(store.isFavorite(25)).toBe(true)
    expect(store.count).toBe(1)

    expect(store.toggle(pikachu)).toBe(false)
    expect(store.isFavorite(25)).toBe(false)
    expect(store.count).toBe(0)
  })

  it('no duplica un favorito ya existente', () => {
    const store = useFavoritesStore()
    const eevee = makePokemon(133, 'eevee')
    store.add(eevee)
    store.add(eevee)
    expect(store.count).toBe(1)
  })

  it('persiste los favoritos en localStorage', async () => {
    const store = useFavoritesStore()
    store.add(makePokemon(25, 'pikachu'))
    // El watcher persiste de forma asíncrona (flush por defecto).
    await new Promise((resolve) => setTimeout(resolve, 0))
    const stored = localStorage.getItem('global66-pokedex:favorites')
    expect(stored).toContain('pikachu')
  })

  it('se hidrata desde localStorage al inicializarse', () => {
    localStorage.setItem(
      'global66-pokedex:favorites',
      JSON.stringify([makePokemon(1, 'bulbasaur')]),
    )
    setActivePinia(createPinia())
    const store = useFavoritesStore()
    expect(store.isFavorite(1)).toBe(true)
  })
})

import { describe, it, expect } from 'vitest'
import { filterPokemonList, pokemonMatchesQuery } from '@/utils/search'
import type { PokemonTypeName } from '@/types/pokemon'

describe('pokemonMatchesQuery', () => {
  it('devuelve true con búsqueda vacía', () => {
    expect(pokemonMatchesQuery('pikachu', 25, '')).toBe(true)
  })

  it('coincide por nombre (substring, sin distinción de mayúsculas)', () => {
    expect(pokemonMatchesQuery('charizard', 6, 'char')).toBe(true)
    expect(pokemonMatchesQuery('charizard', 6, 'ZARD')).toBe(true)
    expect(pokemonMatchesQuery('charizard', 6, 'pika')).toBe(false)
  })

  it('coincide por número de entrada (id)', () => {
    expect(pokemonMatchesQuery('bulbasaur', 1, '1')).toBe(true)
    expect(pokemonMatchesQuery('pikachu', 25, '25')).toBe(true)
  })

  it('coincide por número con relleno de ceros (001)', () => {
    expect(pokemonMatchesQuery('bulbasaur', 1, '001')).toBe(true)
    expect(pokemonMatchesQuery('bulbasaur', 1, '01')).toBe(true)
  })

  it('no coincide un número que no corresponde', () => {
    expect(pokemonMatchesQuery('pikachu', 25, '99')).toBe(false)
  })
})

describe('filterPokemonList', () => {
  const list = [
    { name: 'bulbasaur', id: 1, types: ['grass', 'poison'] as PokemonTypeName[] },
    { name: 'charmander', id: 4, types: ['fire'] as PokemonTypeName[] },
    { name: 'squirtle', id: 7, types: ['water'] as PokemonTypeName[] },
  ]

  it('sin filtros devuelve la lista completa', () => {
    expect(filterPokemonList(list, '', [])).toHaveLength(3)
  })

  it('filtra por texto (nombre)', () => {
    const result = filterPokemonList(list, 'char', [])
    expect(result.map((p) => p.name)).toEqual(['charmander'])
  })

  it('filtra por tipo (unión)', () => {
    const result = filterPokemonList(list, '', ['fire', 'water'])
    expect(result.map((p) => p.name)).toEqual(['charmander', 'squirtle'])
  })

  it('combina texto y tipo', () => {
    expect(filterPokemonList(list, '1', ['grass'])).toHaveLength(1)
    expect(filterPokemonList(list, 'squirtle', ['grass'])).toHaveLength(0)
  })
})

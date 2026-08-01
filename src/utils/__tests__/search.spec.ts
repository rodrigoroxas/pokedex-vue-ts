import { describe, it, expect } from 'vitest'
import { pokemonMatchesQuery } from '@/utils/search'

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

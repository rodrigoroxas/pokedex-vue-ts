import { describe, it, expect } from 'vitest'
import type { Pokemon } from '@/types/pokemon'
import {
  capitalize,
  extractIdFromUrl,
  formatPokedexNumber,
  formatShareText,
} from '@/utils/format'

const bulbasaur: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  types: ['grass', 'poison'],
  heightMeters: 0.7,
  weightKg: 6.9,
  abilities: ['overgrow'],
  stats: [
    { name: 'PS', value: 45 },
    { name: 'Ataque', value: 49 },
  ],
  spriteUrl: 'sprite.png',
  artworkUrl: 'artwork.png',
  weaknesses: ['fire', 'ice'],
  speciesUrl: '',
}

describe('formatPokedexNumber', () => {
  it('rellena con ceros a la izquierda hasta 3 dígitos', () => {
    expect(formatPokedexNumber(1)).toBe('Nº001')
    expect(formatPokedexNumber(25)).toBe('Nº025')
    expect(formatPokedexNumber(150)).toBe('Nº150')
  })
})

describe('capitalize', () => {
  it('pone en mayúscula la primera letra', () => {
    expect(capitalize('pikachu')).toBe('Pikachu')
  })
})

describe('extractIdFromUrl', () => {
  it('extrae el id numérico de la url del recurso', () => {
    expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
  })

  it('devuelve 0 si la url no contiene id', () => {
    expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/')).toBe(0)
  })
})

describe('formatShareText', () => {
  it('incluye nombre y atributos separados por coma', () => {
    const text = formatShareText(bulbasaur)
    expect(text).toContain('Bulbasaur')
    expect(text).toContain('Nº001')
    expect(text).toContain('Planta')
    expect(text).toContain('Veneno')
    expect(text).toContain('Peso: 6.9 kg')
    expect(text).toContain('Altura: 0.7 m')
    // Todo el contenido debe estar unido por ", "
    expect(text.split(', ').length).toBeGreaterThan(4)
  })

  it('incluye categoría y habilidad cuando se proporcionan', () => {
    const text = formatShareText(bulbasaur, { category: 'Semilla', ability: 'Espesura' })
    expect(text).toContain('Categoría: Semilla')
    expect(text).toContain('Habilidad: Espesura')
  })

  it('omite categoría y habilidad si no se proporcionan', () => {
    const text = formatShareText(bulbasaur)
    expect(text).not.toContain('Categoría')
    expect(text).not.toContain('Habilidad')
  })
})

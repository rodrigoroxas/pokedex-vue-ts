import { describe, it, expect } from 'vitest'
import { computeWeaknesses, getTypeLabel } from '@/utils/pokemonType'

describe('getTypeLabel', () => {
  it('traduce el tipo al español', () => {
    expect(getTypeLabel('grass')).toBe('Planta')
    expect(getTypeLabel('fire')).toBe('Fuego')
  })

  it('hace fallback al nombre crudo si el tipo es desconocido', () => {
    expect(getTypeLabel('mistery')).toBe('mistery')
  })
})

describe('computeWeaknesses', () => {
  it('calcula debilidades de un tipo simple (fuego → agua, tierra, roca)', () => {
    const weaknesses = computeWeaknesses(['fire'])
    expect(weaknesses).toEqual(expect.arrayContaining(['water', 'ground', 'rock']))
    expect(weaknesses).not.toContain('grass') // el fuego resiste planta
  })

  it('combina ambos tipos multiplicando efectividades (grass/poison)', () => {
    const weaknesses = computeWeaknesses(['grass', 'poison'])
    // Fuego, psíquico, volador y hielo son debilidades del dúo Planta/Veneno.
    expect(weaknesses).toEqual(expect.arrayContaining(['fire', 'psychic', 'flying', 'ice']))
    // El agua es neutral (planta la resiste, veneno neutral) → no es debilidad.
    expect(weaknesses).not.toContain('water')
  })

  it('anula la debilidad cuando el otro tipo aporta inmunidad', () => {
    // Tierra es débil a agua; volar es inmune a tierra pero eso no aplica aquí.
    // Volador/tierra: la inmunidad de volador a tierra no afecta a la debilidad a agua.
    const weaknesses = computeWeaknesses(['ground', 'flying'])
    expect(weaknesses).not.toContain('electric') // volador inmune a eléctrico
  })
})

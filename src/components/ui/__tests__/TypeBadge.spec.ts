import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TypeBadge from '@/components/ui/TypeBadge.vue'

describe('TypeBadge', () => {
  it('muestra la etiqueta del tipo en español', () => {
    const wrapper = mount(TypeBadge, { props: { type: 'water' } })
    expect(wrapper.text()).toContain('Agua')
  })

  it('aplica el color del tipo como fondo', () => {
    const wrapper = mount(TypeBadge, { props: { type: 'fire' } })
    expect(wrapper.attributes('style')).toContain('--type-fire')
  })

  it('respeta el tamaño recibido por prop', () => {
    const wrapper = mount(TypeBadge, { props: { type: 'grass', size: 'sm' } })
    expect(wrapper.classes()).toContain('badge--sm')
  })
})

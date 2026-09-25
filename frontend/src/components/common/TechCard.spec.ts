import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TechCard from './TechCard.vue'

describe('TechCard', () => {
  it('renders card content', () => {
    const wrapper = mount(TechCard, {
      slots: { default: 'Card content' }
    })
    expect(wrapper.text()).toBe('Card content')
  })

  it('renders title slot', () => {
    const wrapper = mount(TechCard, {
      slots: { title: 'Card Title' }
    })
    expect(wrapper.text()).toContain('Card Title')
  })

  it('renders footer slot', () => {
    const wrapper = mount(TechCard, {
      slots: { footer: 'Card Footer' }
    })
    expect(wrapper.text()).toContain('Card Footer')
  })

  it('applies tech-card class', () => {
    const wrapper = mount(TechCard)
    expect(wrapper.find('.tech-card').exists()).toBe(true)
  })
})

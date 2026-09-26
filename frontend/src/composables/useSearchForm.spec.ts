import { describe, it, expect } from 'vitest'
import { useSearchForm } from './useSearchForm'

describe('useSearchForm', () => {
  it('initializes with empty form', () => {
    const { form } = useSearchForm<{ keyword: string; category: string }>()
    expect(form).toEqual({})
  })

  it('initializes with initial values', () => {
    const { form } = useSearchForm<{ keyword: string; category: string }>({
      keyword: 'test',
      category: 'tech'
    })
    expect(form).toEqual({ keyword: 'test', category: 'tech' })
  })

  it('returns clean values without empty strings', () => {
    const { form, getCleanValues } = useSearchForm<{ keyword: string; category: string }>({
      keyword: 'test',
      category: ''
    })
    const cleanValues = getCleanValues()
    expect(cleanValues).toEqual({ keyword: 'test' })
  })

  it('returns clean values without null', () => {
    const { form, getCleanValues } = useSearchForm<{ keyword: string | null; category: string }>({
      keyword: null,
      category: 'tech'
    })
    const cleanValues = getCleanValues()
    expect(cleanValues).toEqual({ category: 'tech' })
  })

  it('resets form to initial values', () => {
    const { form, setField, reset } = useSearchForm<{ keyword: string; category: string }>({
      keyword: 'initial',
      category: 'initial'
    })
    setField('keyword', 'modified')
    reset()
    expect(form).toEqual({ keyword: 'initial', category: 'initial' })
  })

  it('resets form to empty if no initial values', () => {
    const { form, setField, reset } = useSearchForm<{ keyword: string }>()
    setField('keyword', 'test')
    reset()
    expect(form).toEqual({})
  })
})

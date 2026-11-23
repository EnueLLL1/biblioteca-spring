import { describe, it, expect } from 'vitest'
import { addDaysISO, formatDateBR, getLoanDueStatus } from './date'

describe('utils/date', () => {
  it('formata data ISO YYYY-MM-DD para DD/MM/AAAA sem deslocamento de fuso', () => {
    expect(formatDateBR('2026-11-23')).toBe('23/11/2026')
    expect(formatDateBR('2026-01-01')).toBe('01/01/2026')
    expect(formatDateBR(null)).toBe('—')
  })

  it('soma dias mantendo calendário local sem drift', () => {
    expect(addDaysISO('2026-11-23', 7)).toBe('2026-11-30')
    expect(addDaysISO('2026-12-28', 7)).toBe('2027-01-04')
  })

  it('calcula status de prazo para atrasado, hoje e dentro do prazo', () => {
    expect(getLoanDueStatus('2026-11-20', '2026-11-23')).toEqual({
      state: 'overdue',
      days: 3,
      label: 'Atrasado há 3 dias',
    })

    expect(getLoanDueStatus('2026-11-23', '2026-11-23')).toEqual({
      state: 'today',
      days: 0,
      label: 'Vence hoje',
    })

    expect(getLoanDueStatus('2026-11-28', '2026-11-23')).toEqual({
      state: 'upcoming',
      days: 5,
      label: 'Restam 5 dias',
    })
  })
})

const STORAGE_KEY = 'color-scheme'

export function getStoredScheme() {
  try {
    const val = localStorage.getItem(STORAGE_KEY)
    return val === 'light' || val === 'dark' ? val : null
  } catch {
    return null
  }
}

export function getSystemScheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getResolvedScheme() {
  return getStoredScheme() ?? getSystemScheme()
}

export function applySchemeMeta(storedScheme) {
  if (typeof document === 'undefined') return
  const meta = document.querySelector('meta[name="color-scheme"]')
  if (!meta) return
  meta.setAttribute('content', storedScheme ?? 'light dark')
}

export function toggleColorScheme() {
  const currentRendered = getResolvedScheme()
  const target = currentRendered === 'dark' ? 'light' : 'dark'
  const system = getSystemScheme()

  let nextStored = null
  try {
    if (target === system) {
      localStorage.removeItem(STORAGE_KEY)
      nextStored = null
    } else {
      localStorage.setItem(STORAGE_KEY, target)
      nextStored = target
    }
  } catch {
    nextStored = target === system ? null : target
  }

  applySchemeMeta(nextStored)
  return nextStored ?? system
}

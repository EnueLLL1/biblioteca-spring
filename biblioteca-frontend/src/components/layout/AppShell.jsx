import { useEffect, useId, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  BookOpen,
  Bookmark,
  Feather,
  FolderOpen,
  LayoutDashboard,
  Library,
  Menu,
  Moon,
  Repeat,
  Sun,
  Users,
  X,
} from 'lucide-react'
import {
  applySchemeMeta,
  getResolvedScheme,
  getStoredScheme,
  toggleColorScheme,
} from '../../utils/theme'

const NAV_GROUPS = [
  {
    label: 'Visão Geral',
    items: [{ to: '/', label: 'Início', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Circulação',
    items: [
      { to: '/livros', label: 'Livros', icon: BookOpen },
      { to: '/emprestimos', label: 'Empréstimos', icon: Repeat },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { to: '/autores', label: 'Autores', icon: Feather },
      { to: '/usuarios', label: 'Usuários', icon: Users },
      { to: '/categorias', label: 'Categorias', icon: FolderOpen },
      { to: '/generos', label: 'Gêneros', icon: Bookmark },
    ],
  },
]

function NavItems({ onNavigate }) {
  return (
    <nav aria-label="Navegação principal" className="flex-1 space-y-6 px-3 py-5">
      {NAV_GROUPS.map(group => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-ink-muted uppercase">
            {group.label}
          </p>
          <ul className="space-y-1">
            {group.items.map(item => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={Boolean(item.end)}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        isActive
                          ? 'bg-accent-soft text-accent font-semibold'
                          : 'text-ink-muted hover:bg-subtle hover:text-ink'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function ThemeButton({ scheme, onToggle, compact = false }) {
  const isDark = scheme === 'dark'
  const actionLabel = isDark ? 'Ativar tema claro' : 'Ativar tema escuro'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={actionLabel}
      className={`inline-flex items-center gap-2.5 rounded-lg border border-edge bg-canvas/70 text-sm font-medium text-ink transition hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        compact ? 'px-2.5 py-2' : 'w-full justify-between px-3 py-2'
      }`}
    >
      <span className="inline-flex items-center gap-2">
        {isDark ? (
          <Sun className="h-4 w-4 text-warning" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4 text-accent" aria-hidden="true" />
        )}
        {!compact && <span>{isDark ? 'Tema claro' : 'Tema escuro'}</span>}
      </span>
      {!compact && (
        <span className="rounded bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
          {isDark ? 'Escuro' : 'Claro'}
        </span>
      )}
    </button>
  )
}

export default function AppShell({ children }) {
  const [scheme, setScheme] = useState(() => getResolvedScheme())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef(null)
  const sheetRef = useRef(null)
  const drawerId = useId()
  const location = useLocation()

  useEffect(() => {
    const sync = () => {
      applySchemeMeta(getStoredScheme())
      setScheme(getResolvedScheme())
    }

    sync()

    const media =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null

    media?.addEventListener?.('change', sync)
    window.addEventListener('storage', sync)

    return () => {
      media?.removeEventListener?.('change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer) return

    if (drawerOpen) {
      if (!drawer.hasAttribute('open') && typeof drawer.showModal === 'function') {
        drawer.showModal()
      }
    } else if (drawer.hasAttribute('open') && typeof drawer.close === 'function') {
      drawer.close()
    }
  }, [drawerOpen])

  const handleToggleTheme = () => {
    const next = toggleColorScheme()
    setScheme(next)
  }

  const handleDrawerBackdropClick = event => {
    if (sheetRef.current && !sheetRef.current.contains(event.target)) {
      setDrawerOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-ink lg:flex">
      {/* Sidebar fixa no desktop */}
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-edge lg:bg-surface">
        <div className="flex items-center gap-3 border-b border-edge px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-fg">
            <Library className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-serif text-lg font-semibold leading-tight text-ink">
              Biblioteca
            </p>
            <p className="text-xs text-ink-muted">Gestão de Acervo</p>
          </div>
        </div>

        <NavItems />

        <div className="border-t border-edge p-4">
          <ThemeButton scheme={scheme} onToggle={handleToggleTheme} />
        </div>
      </aside>

      {/* Cabeçalho mobile + Drawer */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-edge bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu de navegação"
              aria-controls={drawerId}
              aria-expanded={drawerOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-edge bg-canvas text-ink transition hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2">
              <Library className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-serif text-lg font-semibold text-ink">Biblioteca</span>
            </div>
          </div>
          <ThemeButton scheme={scheme} onToggle={handleToggleTheme} compact />
        </header>

        <dialog
          ref={drawerRef}
          id={drawerId}
          aria-label="Menu de navegação"
          onClose={() => setDrawerOpen(false)}
          onClick={handleDrawerBackdropClick}
          className="nav-drawer"
        >
          <div ref={sheetRef} className="nav-drawer-sheet flex flex-col">
            <div className="flex items-center justify-between border-b border-edge px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg">
                  <Library className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="font-serif text-lg font-semibold text-ink">Biblioteca</span>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setDrawerOpen(false)}
                aria-label="Fechar menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition hover:bg-subtle hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <NavItems onNavigate={() => setDrawerOpen(false)} />

            <div className="border-t border-edge p-4">
              <ThemeButton scheme={scheme} onToggle={handleToggleTheme} />
            </div>
          </div>
        </dialog>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-7 sm:px-6 lg:px-10 lg:py-9">
          {children}
        </main>
      </div>
    </div>
  )
}

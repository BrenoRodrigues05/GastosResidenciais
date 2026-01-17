import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const navItems = [
    { path: '/pessoas', label: 'Pessoas' },
    { path: '/categorias', label: 'Categorias' },
    { path: '/transacoes', label: 'Transações' },
    { path: '/relatorios', label: 'Relatórios' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/pessoas" className="text-xl font-bold">
              Gestão de Gastos
            </Link>
            <ul className="flex flex-wrap gap-4 md:gap-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary',
                      location.pathname === item.path
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
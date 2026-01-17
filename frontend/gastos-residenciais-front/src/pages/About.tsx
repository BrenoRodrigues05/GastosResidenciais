import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function About() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Sobre o Template</h1>
        <p className="text-muted-foreground">
          Informações sobre as tecnologias utilizadas neste template.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>React + TypeScript</CardTitle>
            <CardDescription>Framework moderno com tipagem estática</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              React 18 com TypeScript para uma experiência de desenvolvimento robusta e type-safe.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vite</CardTitle>
            <CardDescription>Build tool rápido e moderno</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vite oferece HMR extremamente rápido e builds otimizados para produção.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>React Query</CardTitle>
            <CardDescription>Gerenciamento de estado do servidor</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              TanStack Query para fetching, caching e sincronização de dados do servidor.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>React Router</CardTitle>
            <CardDescription>Roteamento declarativo</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              React Router DOM para navegação entre páginas e rotas.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>shadcn/ui</CardTitle>
            <CardDescription>Componentes UI acessíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Componentes baseados em Radix UI e Tailwind CSS, totalmente customizáveis.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Axios</CardTitle>
            <CardDescription>Cliente HTTP</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Axios configurado com interceptors para requisições e respostas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from "@/api/client"

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export default function Home() {
  const { data, isLoading, error, refetch } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await api.get('/posts?_limit=5')
      return response.data
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Bem-vindo ao Template React</h1>
        <p className="text-muted-foreground">
          Este é um template configurado com TypeScript, Vite, React Query, React Router, shadcn/ui e Axios.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exemplo de React Query</CardTitle>
          <CardDescription>
            Buscando dados de uma API usando React Query e Axios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p>Carregando...</p>}
          
          {error && (
            <div className="text-destructive">
              <p>Erro ao carregar os dados. Tente novamente.</p>
              <Button onClick={() => refetch()} className="mt-2">
                Tentar novamente
              </Button>
            </div>
          )}

          {data && (
            <div className="space-y-4">
              <Button onClick={() => refetch()}>
                Atualizar dados
              </Button>
              <div className="space-y-2">
                {data.map((post) => (
                  <div key={post.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-1">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">{post.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
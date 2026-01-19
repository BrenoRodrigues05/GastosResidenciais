import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7108',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Tratamento global de erros
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Não autorizado')
          break
        case 403:
          console.error('Acesso negado')
          break
        case 404:
          console.error('Recurso não encontrado')
          break
        case 500:
          console.error('Erro interno do servidor')
          break
        default:
          console.error('Erro na requisição:', error.message)
      }
    } else if (error.request) {
      console.error('Erro de rede - nenhuma resposta recebida')
    }
    return Promise.reject(error)
  }
)

export default api
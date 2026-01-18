
export function useToast() {
  return {
    toast: (message: string, variant: 'default' | 'error' = 'default') => {
      if (variant === 'error') {
        alert(`Erro: ${message}`)
      } else {
        alert(message)
      }
    },
  }
}

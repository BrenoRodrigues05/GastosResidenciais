// Hook simples de toast para o sistema
export function useToast() {
  return {
    toast: (message: string, variant: 'default' | 'error' = 'default') => {
      // Por enquanto, usar alert. Pode ser melhorado com um componente de toast
      if (variant === 'error') {
        alert(`Erro: ${message}`)
      } else {
        alert(message)
      }
    },
  }
}

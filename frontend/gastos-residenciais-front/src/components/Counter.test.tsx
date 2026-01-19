import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

describe('Counter', () => {
  it('deve começar com 0', () => {
    render(<Counter />)
    expect(screen.getByLabelText('valor')).toHaveTextContent('0')
  })

  it('deve somar ao clicar no botão', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByRole('button', { name: /somar/i }))
    expect(screen.getByLabelText('valor')).toHaveTextContent('1')
  })
})

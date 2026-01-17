# React Vite Template

Template moderno de aplicação React com TypeScript, Vite, React Query, React Router, shadcn/ui e Axios.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool rápido e moderno
- **React Query** (@tanstack/react-query) - Gerenciamento de estado do servidor
- **React Router** - Roteamento declarativo
- **shadcn/ui** - Componentes UI acessíveis e customizáveis
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS utilitário

## 📦 Instalação

```bash
# Instalar dependências
npm install

# ou
yarn install

# ou
pnpm install
```

## 🛠️ Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Lint do código
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes do shadcn/ui
│   └── Layout.tsx      # Layout principal
├── lib/                # Utilitários e configurações
│   ├── axios.ts        # Configuração do Axios
│   └── utils.ts        # Funções utilitárias
├── pages/              # Páginas da aplicação
│   ├── Home.tsx
│   └── About.tsx
├── App.tsx             # Componente raiz
├── main.tsx            # Ponto de entrada
└── index.css           # Estilos globais
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=https://sua-api.com
```

### Configuração do Axios

O cliente Axios está configurado em `src/lib/axios.ts` com interceptors para:
- Adicionar tokens de autenticação automaticamente
- Tratamento global de erros

### React Query

O QueryClient está configurado em `src/main.tsx` com opções padrão. Você pode personalizar as configurações conforme necessário.

## 🎨 shadcn/ui

Os componentes do shadcn/ui podem ser adicionados usando o CLI:

```bash
npx shadcn-ui@latest add [component-name]
```

Componentes já incluídos:
- Button
- Card

## 📝 Licença

MIT
export type FinalidadeCategoriaText = 'Despesa' | 'Receita' | 'Ambas'

// Enums
export enum TipoTransacao {
  Despesa = 1,
  Receita = 2,
}

export enum FinalidadeCategoria {
  Despesa = 1,
  Receita = 2,
  Ambas = 3,
}

// DTOs de Transação
export interface TransacaoCreateDto {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: number;
  pessoaId: number;
  data?: string;
}

export interface TransacaoListDto {
  id: number
  descricao: string
  valor: number
  tipo: TipoTransacao
  categoriaId: number
  categoriaDescricao: string
  categoriaFinalidade: 'Despesa' | 'Receita' | 'Ambas'
  pessoaId: number
  pessoaNome: string
  data?: string
}

export interface TransacaoCreateResponse {
  id: number;
}

// DTOs de Pessoa
export interface PessoaCreateDto {
  nome: string;
  idade: number;
}

export interface PessoaListDto {
  id: number;
  nome: string;
  idade: number;
}

export interface PessoaUpdateDto {
  nome: string;
  idade: number;
}

export interface PessoaCreateResponse {
  id: number;
}

// DTOs de Categoria
export interface CategoriaCreateDto {
  descricao: string;
  finalidade: FinalidadeCategoria;
}

export interface CategoriaListDto {
  id: number
  descricao: string
  finalidade: FinalidadeCategoriaText
}

export interface CategoriaUpdateDto {
  descricao: string;
  finalidade: FinalidadeCategoria;
}

export interface CategoriaCreateResponse {
  id: number;
}

// DTOs de Relatório
export interface RelatorioPessoaTotaisDto {
  pessoaId: number;
  pessoaNome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface RelatorioTotalGeralDto {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface RelatorioTotaisPorPessoaResponseDto {
  pessoas: RelatorioPessoaTotaisDto[];
  totalGeral: RelatorioTotalGeralDto;
}

// DTO de Erro
export interface ApiErrorDto {
  error: string;
}

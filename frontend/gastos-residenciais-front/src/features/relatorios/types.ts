export type TotaisPessoa = {
  pessoaId: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
};

export type TotaisGerais = {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
};

export type RelatorioTotaisPorPessoaResponse = {
  pessoas: TotaisPessoa[];
  totalGeral: TotaisGerais;
};

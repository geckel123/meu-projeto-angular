export class DadosResultadoLoja {
    
    constructor(public ordem: number,
    public operacao: string,
    public valor: number) {}
}

export interface IConsultaResultadoLoja {
    resultVendasTauros: DadosResultadoLoja[],
    operacaoVendasTauros: DadosResultadoLoja[],
    setorVendasTauros: DadosResultadoLoja[],
    totalOperacao: DadosResultadoLoja,
    totalSetor: DadosResultadoLoja,
    totalComissionado: DadosResultadoLoja,
    totalNaoComissionado: DadosResultadoLoja
}
export class Receb {
    constructor(public nroSeqTransacao: number,
                public nroParcelas: number,
                public vlrTransacao: number,
                public nroControle: string,
                public nroCupomTef: number) {}
}

export class VendaTef {
    constructor(public planoVenda: string,
                public vlrReceb: number) {}
}

export class ItensVenda {
    constructor(public idcCancelado:string,
                public codProduto:string,
                public desProduto:string,
                public descricaoCor:string,
                public desResTamanho:string,
                public prcUnitario:number,
                public nroItem:number) {}
}
export class DadosResultadoCupons {
    
    constructor(public codEstab: string,
    public nroPdv: number,
    public nroSeqVenda: number,
    public nsu: number,
    public datVenda: Date,
    public horVenda: string,
    public vlrProduto: number,
    public vlrVenda: number,
    public codProduto: string,
    public qtdItem: number,
    public listReceb: Receb[],
    public listVendaTef: VendaTef[],
    public listItensVenda: ItensVenda[],
    public dataHora: string) {}
}

export interface IConsultaCuponsTroca {
    results: DadosResultadoCupons[]
}

export interface IConsultaDetalhesCuponsTroca {
    results: DadosResultadoCupons
}
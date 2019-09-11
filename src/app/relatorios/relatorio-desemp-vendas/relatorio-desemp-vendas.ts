
export class FuncaoLoja {
    constructor(public codFuncao: string,
                public idtTipoFuncao: string,
                public desFuncao: string,
                public idtAutonomiaRg: string,
                public codCargo: number,
                public gerente: boolean){}
}

export class ListFunc{
    constructor(public datOperacao: Date,
        public matrFuncSetor: string,
        public nomFunc: string,
        public codFuncao: string,
        public nomSetor: string,
        public vlrOperacao: number,
        public vlrOperacaoSemGift: number,
        public nroAtend: number,
        public qtdItem: number,
        public qtdVendas: number,
        public qtdMediaItem: number,
        public vlrMedioItem: number,
        public vlrComissao: number,
        public vlrVendaBru: number,
        public vlrVendaLiq: number,
        public vlrMedVenda: number,
        public funcaoLoja: FuncaoLoja){}
}

export class MapFunc{
    constructor(public matrFuncSetor: string,
        public nomFunc: string,
        public codFuncao: string,
        public listFunc: ListFunc[],
        public totFunc: ListFunc){}
}

export class Diario{
    constructor(public datMapeada: Date,
                public mapFunc: MapFunc[],
                public totDia: ListFunc){}
}

export class MapDiario{
    
    constructor(public diario: Diario[]){}
}

export class DiarioSemSetor{
    constructor(public datMapeada: Date,
                public listVendedor: ListFunc[],
                public totVendedor: ListFunc,
                public listGerente: ListFunc[],
                public totGerente: ListFunc,
                public totDia: ListFunc){}
}

export class MapDiarioSemSetor{
    
    constructor(public diario: DiarioSemSetor[]){}
}
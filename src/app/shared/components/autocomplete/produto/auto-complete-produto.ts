export class Produto {
    constructor(
        public codProduto: string, 
        public desProduto: string
      ) {}
  }
  
  export interface IProdutoResponse {
    results: Produto[];
  }
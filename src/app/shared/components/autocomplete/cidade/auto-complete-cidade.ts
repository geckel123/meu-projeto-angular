import { ListData } from "src/app/shared/interfaces/list-data";

export class Cidade {
    constructor(
      public COD_CIDADE: string,
      public NOM_CIDADE: string,
      public COD_TERRITORIO: string,
      public SGL_UF: string,
      public COD_IBGE: string,
      public COD_CIDADE_UF: string,
      public IDT_CIDADE_ZFM: string,
      public IDT_ATIVO: string,
      public DAT_ULT_MANUT: string,
      public MLA_ULT_MANUT: string
      ) {}
  }
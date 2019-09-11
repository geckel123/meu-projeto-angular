export class PdvNfce {
    constructor(public COD_ESTAB: string,
        public NRO_PDV: string,
        public COD_ATIVACAO_SAT: string,
        public COD_MODELO_SAT: string,
        public NOM_USUARIO_NFCE: string,
        public DES_SENHA_NFCE: string,
        public NRO_ULTIMO_NFCE: string,
        public COD_SERIE_NFCE: string,
        public DAT_ULT_MANUT: string,
        public MLA_ULT_MANUT: string,
        public IDT_TIPO_AMBIENTE: string,
        public COD_SERIE_SAT: string,
        public SERIE_EQUIP_SAT: string,
        public AGENT_SATHOST: string,
        public AGENT_SATPORTA: string,
        public AGENT_TIPO: string
    ) {}
}
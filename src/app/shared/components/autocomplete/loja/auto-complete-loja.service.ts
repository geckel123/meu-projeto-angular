import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CadastroEstabelecimentosService } from 'src/app/cadastros/cadastro-estabelecimentos/cadastro-estabelecimentos.service';
import { ResponseData } from 'src/app/shared/interfaces/response-data';
import { ListData } from 'src/app/shared/interfaces/list-data';
import { Estabelecimento } from 'src/app/cadastros/cadastro-estabelecimentos/cadastro-estabelecimentos';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class AutoCompleteLojaService {
    constructor(private cadEstabService: CadastroEstabelecimentosService) { }

    search(filter: any = ''): Observable<ResponseData<ListData<Estabelecimento>>> {
        if(filter instanceof Estabelecimento){
            filter = filter.COD_ESTABELECIMENT;
        }
        if(filter) {
            return this.cadEstabService.list(filter,0,50)
            .pipe(
                tap((response: ResponseData<ListData<Estabelecimento>>) => {
                    response.dados.listaRegistros = response.dados.listaRegistros
                        .map(loja => new Estabelecimento(loja.COD_ESTABELECIMENT,
                            loja.DES_ESTABELECIMENT,
                            loja.CGC_ESTABELECIMENT,
                            loja.NOM_LOGRADOURO,
                            loja.NRO_ESTABELECIMENT,
                            loja.DES_COMPLEMENTO,
                            loja.NOM_BAIRRO,
                            loja.COD_CEP,
                            loja.NOM_MUNICIPIO,
                            loja.SGL_UF,
                            loja.NRO_TELEFONE,
                            loja.NRO_FAX,
                            loja.NRO_TELEX,
                            loja.COD_INSCRIC_ESTADU,
                            loja.NRO_JUNTA_COMERCIA,
                            loja.DAT_REGISTRO_ESTAB,
                            loja.NOM_CONTADOR,
                            loja.COD_CRC_CONTADOR,
                            loja.SGL_UF_CRC_CONTAD,
                            loja.NOM_TITULAR_ESTAB,
                            loja.NOM_FANTASIA_ESTAB,
                            loja.IDT_MATRIZ,
                            loja.COD_SEGMENTO,
                            loja.COD_INSC_MUNICIPAL,
                            loja.COD_CIDADE_EST,
                            loja.COD_INSCRI_SUFRAMA,
                            loja.COD_REPART_FISCAL,
                            loja.COD_INSCRICAO_ST,
                            loja.COD_MATRIZ,
                            loja.IDT_CUSTO_ST,
                            loja.IDT_LR_MESMAROTA,
                            loja.IDT_CD_CT,
                            loja.IDT_REC_LJ_PONTO,
                            loja.IDT_REC_LJ_RETAGUARDA,
                            loja.IDT_REC_LJ_AUTOFUNC,
                            loja.COD_VER_NFE,
                            loja.IDT_TIP_ESTAB,
                            loja.IDC_EFETUA_VENDA,
                            loja.DES_MENS_CABECALHO,
                            loja.DES_MENS_PROMOC1,
                            loja.DES_MENS_PROMOC2,
                            loja.IDC_FAZ_COMPRA,
                            loja.IDC_LOCAL_ENTREGA,
                            loja.IDC_LOCAL_COBRANCA,
                            loja.IDC_CAD_CHEQUE,
                            loja.NRO_ULTIMO_SEQ,
                            loja.NRO_ULT_CLIENTE,
                            loja.NRO_ULT_EMPRESA,
                            loja.NRO_ULT_CONTRATO,
                            loja.VLR_LIMITE_SANGRIA,
                            loja.COD_CPU,
                            loja.VLR_ABERTURA_PDVS,
                            loja.VLR_LIMITE_RESSUP,
                            loja.PER_NEGOC_ENTRADA,
                            loja.NRO_DIAS_NEGOC_PRE,
                            loja.LIM_MAIOR_ATRASO,
                            loja.QTD_METROS_QUADRAD,
                            loja.NRO_ULT_PROTOCOLO,
                            loja.IDC_FRANQUEADA,
                            loja.VLR_REPASSE,
                            loja.COD_BANCO_DEP,
                            loja.COD_AGENCIA_DEP,
                            loja.NRO_CONTA_DEP,
                            loja.COD_SBF,
                            loja.COD_MASTER,
                            loja.COD_REDE_LOJA,
                            loja.NRO_LOJA,
                            loja.COD_TERRITORIO,
                            loja.COD_CIDADE,
                            loja.COD_LOCALIZACAO,
                            loja.COD_SHOPPING,
                            loja.COD_FRANQUEADO,
                            loja.COD_GRUPO_PRECO,
                            loja.NRO_DIAS_MAQ_IMED,
                            loja.IDT_TIP_ATEND,
                            loja.IDC_TEM_SETOR,
                            loja.COD_FORMATO_LOJA,
                            loja.COD_REGIAO_LOJA,
                            loja.COD_LOCALIZ_CIDADE,
                            loja.COD_CONDICAO_ECON,
                            loja.COD_CLIMA_LOJA,
                            loja.VLR_AREA_BRUTA,
                            loja.COD_EMPRESA_SCOPE,
                            loja.COD_ESTAB_SCOPE,
                            loja.DAT_INAUGURACAO,
                            loja.DAT_FECHAMENTO,
                            loja.NRO_PARCELAS_ETQ,
                            loja.VLR_MINIMO_ETQ,
                            loja.COD_CONVENIO_CBO,
                            loja.COD_AGENCIA_BB,
                            loja.NRO_ESTAB_BB,
                            loja.COD_CONVENIO_PCA,
                            loja.NOM_LOCALIZACAO,
                            loja.IDT_TIP_SISTEMA,
                            loja.IDT_PREMIER_MG,
                            loja.IDT_CD_PESADOS,
                            loja.IDT_INFORMA_QTD,
                            loja.IDT_CANCELA_ITEM,
                            loja.IDT_SENHA_CAN_ITEM,
                            loja.IDT_CAPTURA_EMAIL,
                            loja.COD_LOC_BRADESCARD,
                            loja.IDT_NOVO_MOL,
                            loja.IDT_LJ_P2K,
                            loja.IDT_SAP,
                            loja.IDT_PRODUTO_COMISS,
                            loja.IDT_FAIXA_COMISSAO,
                            loja.IDT_DEVOLUCA));
                    return response;
                })
            );
        } else {
            return new Observable<ResponseData<ListData<Estabelecimento>>>();
        }
    }
}
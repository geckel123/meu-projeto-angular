import { Component, OnInit } from "@angular/core";
import { CadastroEstabelecimentosService } from "../cadastro-estabelecimentos.service";
import { Observable } from "rxjs";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap, debounceTime } from "rxjs/operators";
import { Estabelecimento } from "../cadastro-estabelecimentos";
import { ResponseData } from "src/app/shared/interfaces/response-data";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ListData } from "src/app/shared/interfaces/list-data";
import { Cidade } from "src/app/shared/components/autocomplete/cidade/auto-complete-cidade";
import { Shopping } from "../../cadastro-shoppings/cadastro-shoppings";
import { Cpu } from "../../cadastro-cpus/cadastro-cpus";
import { CodigoEstabelecimentoJaExisteValidatorService } from "../codigo-estabelecimento-ja-existe.validator.service";
import { AutoCompleteCidadeService } from "src/app/shared/components/autocomplete/cidade/auto-complete-cidade.service";
import { AutoCompleteLojaService } from "src/app/shared/components/autocomplete/loja/auto-complete-loja.service";
import { AutoCompleteShoppingService } from "src/app/shared/components/autocomplete/shopping/auto-complete-shopping.service";
import { AutoCompleteCpuService } from "src/app/shared/components/autocomplete/cpu/auto-complete-cpu.service";
import { CadastroUfsService } from "../../cadastro-ufs/cadastro-ufs.service";
import { CadastroSegmentosEconomicosService } from "../../cadastro-segmentos-economicos/cadastro-segmentos-economicos.service";
import { CadastroFranqueadosService } from "../../cadastro-franqueados/cadastro-franqueados.service";
import { CadastroConjuntosEmpresariaisService } from "../../cadastro-conjuntos-empresariais/cadastro-conjuntos-empresariais.service";
import { CadastroGruposEmpresariaisService } from "../../cadastro-grupos-empresariais/cadastro-grupos-empresariais.service";
import { CadastroRedesLojasService } from "../../cadastro-redes-lojas/cadastro-redes-lojas.service";
import { CadastroLocalizacoesLojasService } from "../../cadastro-localizacoes-lojas/cadastro-localizacoes-lojas.service";
import { CadastroGruposPrecosService } from "../../cadastro-grupos-precos/cadastro-grupos-precos.service";
import { CadastroFormatosLojasService } from "../../cadastro-formatos-lojas/cadastro-formatos-lojas.service";
import { CadastroRegioesLojasService } from "../../cadastro-regioes-lojas/cadastro-regioes-lojas.service";
import { CadastroLocalizacoesCidadesService } from "../../cadastro-localizacoes-cidades/cadastro-localizacoes-cidades.service";
import { CadastroCondicoesEconomicasLojasService } from "../../cadastro-condicoes-economicas-lojas/cadastro-condicoes-economicas-lojas.service";
import { CadastroClimasLojasService } from "../../cadastro-climas-lojas/cadastro-climas-lojas.service";
import { CadastroCidadesService } from "../../cadastro-cidades/cadastro-cidades.service";
import { AlertService } from "src/app/shared/components/alert/alert.service";
import { CnpjValidator } from "src/app/shared/validators/cnpj.validator";
import { EhCidadeValidator } from "src/app/shared/validators/eh-cidade.validator";
import { EhEstabelecimentoValidator } from "src/app/shared/validators/eh-estabelecimento.validator";
import { EhShoppingValidator } from "src/app/shared/validators/eh-shopping.validator";
import { IEValidator } from "../ie.validator";
import { SuframaValidator } from "../suframa.validator";
import { RepartFiscalValidator } from "../repart-fiscal.validator";
import { MesmaRotaValidator } from "../mesma-rota.validator";
import { CdCtValidator } from "../cd-ct.validator";
import * as moment from 'moment';
import { NewEstabelecimento } from "../new-estabelecimento";
import { CadastroShoppingsService } from "../../cadastro-shoppings/cadastro-shoppings.service";
import { CadastroCpusService } from "../../cadastro-cpus/cadastro-cpus.service";

@Component({
    templateUrl: "./alteracao-estabelecimento.component.html"
})
export class AlteracaoEstabelecimentoComponent implements OnInit{
    
    estabelecimentoForm: FormGroup;

    listaUf: any[];
    listaSegmento: any[];
    listaFranqueado: any[];
    listaSbf: any[];
    listaMaster: any[];
    listaRedeLoja: any[];
    listaLocalizacao: any[];
    listaGrupoPreco: any[];
    listaTipoAtend: any[];
    listaFormatoLoja: any[];
    listaRegiaoLoja: any[];
    listaLocalizCidade: any[];
    listaCondEcon: any[];
    listaClimaLoja: any[];
    listaTipoSistema: any[];

    filteredCidades: Observable<ResponseData<ListData<Cidade>>>;
    filteredEstabelecimentos: Observable<ResponseData<ListData<Estabelecimento>>>;
    filteredShoppings: Observable<ResponseData<ListData<Shopping>>>;
    filteredCpus: Observable<ResponseData<ListData<Cpu>>>;


    constructor(private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private cadEstabelecimentoService: CadastroEstabelecimentosService,
        private autoCompleteCidadeService: AutoCompleteCidadeService,
        private autoCompleteEstabService: AutoCompleteLojaService,
        private autoCompleteShoppingService: AutoCompleteShoppingService,
        private autoCompleteCpuService: AutoCompleteCpuService,
        private cadUfService: CadastroUfsService,
        private cadSegmentoService: CadastroSegmentosEconomicosService,
        private cadFranqueadoService: CadastroFranqueadosService,
        private cadSbfService: CadastroConjuntosEmpresariaisService,
        private cadMasterService: CadastroGruposEmpresariaisService,
        private cadRedeLojaService: CadastroRedesLojasService,
        private cadLocalizLojaService: CadastroLocalizacoesLojasService,
        private cadGrupoPrecoService: CadastroGruposPrecosService,
        private cadFormatoLojaService: CadastroFormatosLojasService,
        private cadRegiaoLojaService: CadastroRegioesLojasService,
        private cadLocalizCidadeService: CadastroLocalizacoesCidadesService,
        private cadCondEconService: CadastroCondicoesEconomicasLojasService,
        private cadClimaLojaService: CadastroClimasLojasService,
        private cadCidadeService: CadastroCidadesService,
        private cadShoppingService: CadastroShoppingsService,
        private cadCpuService: CadastroCpusService,
        private alertService: AlertService) {}

    estabelecimento$:Observable<ResponseData<Estabelecimento>>;

    ngOnInit(): void {
        this.carregaForm();
        this.carregaListas();

        this.estabelecimento$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
                return this.cadEstabelecimentoService.get(params.get('id'));
            })
          );
        this.loadData()
    }

    loadData(){
        this.estabelecimento$.subscribe(
            estabelecimento => {
                if(estabelecimento.dados.DAT_REGISTRO_ESTAB!=null)
                    estabelecimento.dados.DAT_REGISTRO_ESTAB = moment(estabelecimento.dados.DAT_REGISTRO_ESTAB).toISOString();
                if(estabelecimento.dados.DAT_INAUGURACAO!=null)
                    estabelecimento.dados.DAT_INAUGURACAO = moment(estabelecimento.dados.DAT_INAUGURACAO).toISOString();
                if(estabelecimento.dados.DAT_FECHAMENTO!=null)
                    estabelecimento.dados.DAT_FECHAMENTO = moment(estabelecimento.dados.DAT_FECHAMENTO).toISOString();
                if(estabelecimento.dados.COD_INSCRIC_ESTADU!=null)
                    estabelecimento.dados.COD_INSCRIC_ESTADU = estabelecimento.dados.COD_INSCRIC_ESTADU.trim();
                if(estabelecimento.dados.NRO_TELEFONE!=null)
                    estabelecimento.dados.NRO_TELEFONE = estabelecimento.dados.NRO_TELEFONE.trim();
                if(estabelecimento.dados.COD_CEP!=null)
                    estabelecimento.dados.COD_CEP = estabelecimento.dados.COD_CEP.trim();
                if(estabelecimento.dados.PER_NEGOC_ENTRADA!==null)
                    estabelecimento.dados.PER_NEGOC_ENTRADA = estabelecimento.dados.PER_NEGOC_ENTRADA.replace(".",",");
                if(estabelecimento.dados.VLR_REPASSE!==null)
                    estabelecimento.dados.VLR_REPASSE = estabelecimento.dados.VLR_REPASSE.replace(".",",");
                if(estabelecimento.dados.VLR_LIMITE_SANGRIA!==null)
                    estabelecimento.dados.VLR_LIMITE_SANGRIA = estabelecimento.dados.VLR_LIMITE_SANGRIA.replace(".",",");
                if(estabelecimento.dados.VLR_ABERTURA_PDVS!==null)
                    estabelecimento.dados.VLR_ABERTURA_PDVS = estabelecimento.dados.VLR_ABERTURA_PDVS.replace(".",",");
                if(estabelecimento.dados.VLR_LIMITE_RESSUP!==null)
                    estabelecimento.dados.VLR_LIMITE_RESSUP = estabelecimento.dados.VLR_LIMITE_RESSUP.replace(".",",");
                if(estabelecimento.dados.VLR_MINIMO_ETQ!==null)
                    estabelecimento.dados.VLR_MINIMO_ETQ = estabelecimento.dados.VLR_MINIMO_ETQ.replace(".",",");
                if(estabelecimento.dados.QTD_METROS_QUADRAD!==null)
                    estabelecimento.dados.QTD_METROS_QUADRAD = estabelecimento.dados.QTD_METROS_QUADRAD.replace(".",",");
                if(estabelecimento.dados.VLR_AREA_BRUTA!==null)
                    estabelecimento.dados.VLR_AREA_BRUTA = estabelecimento.dados.VLR_AREA_BRUTA.replace(".",",");
                if(estabelecimento.dados.COD_VER_NFE!==null)
                    estabelecimento.dados.COD_VER_NFE = estabelecimento.dados.COD_VER_NFE.trim();
                if(estabelecimento.dados.DES_ESTABELECIMENT!==null)
                    estabelecimento.dados.DES_ESTABELECIMENT = estabelecimento.dados.DES_ESTABELECIMENT.trim();
                if(estabelecimento.dados.CGC_ESTABELECIMENT!==null)
                    estabelecimento.dados.CGC_ESTABELECIMENT = estabelecimento.dados.CGC_ESTABELECIMENT.trim();
                if(estabelecimento.dados.NOM_LOGRADOURO!==null)
                    estabelecimento.dados.NOM_LOGRADOURO = estabelecimento.dados.NOM_LOGRADOURO.trim();
                if(estabelecimento.dados.NRO_ESTABELECIMENT!==null)
                    estabelecimento.dados.NRO_ESTABELECIMENT = estabelecimento.dados.NRO_ESTABELECIMENT.trim();
                if(estabelecimento.dados.DES_COMPLEMENTO!==null)
                    estabelecimento.dados.DES_COMPLEMENTO = estabelecimento.dados.DES_COMPLEMENTO.trim();
                if(estabelecimento.dados.NOM_BAIRRO!==null)
                    estabelecimento.dados.NOM_BAIRRO = estabelecimento.dados.NOM_BAIRRO.trim();
                if(estabelecimento.dados.COD_CEP!==null)
                    estabelecimento.dados.COD_CEP = estabelecimento.dados.COD_CEP.trim();
                if(estabelecimento.dados.COD_INSC_MUNICIPAL!==null)
                    estabelecimento.dados.COD_INSC_MUNICIPAL = estabelecimento.dados.COD_INSC_MUNICIPAL.trim();
                if(estabelecimento.dados.NRO_JUNTA_COMERCIA!==null)
                    estabelecimento.dados.NRO_JUNTA_COMERCIA = estabelecimento.dados.NRO_JUNTA_COMERCIA.trim();
                if(estabelecimento.dados.NOM_FANTASIA_ESTAB!==null)
                    estabelecimento.dados.NOM_FANTASIA_ESTAB = estabelecimento.dados.NOM_FANTASIA_ESTAB.trim();
                if(estabelecimento.dados.NOM_TITULAR_ESTAB!==null)
                    estabelecimento.dados.NOM_TITULAR_ESTAB = estabelecimento.dados.NOM_TITULAR_ESTAB.trim();
                if(estabelecimento.dados.NOM_CONTADOR!==null)
                    estabelecimento.dados.NOM_CONTADOR = estabelecimento.dados.NOM_CONTADOR.trim();
                if(estabelecimento.dados.COD_CRC_CONTADOR!==null)
                    estabelecimento.dados.COD_CRC_CONTADOR = estabelecimento.dados.COD_CRC_CONTADOR.trim();
                if(estabelecimento.dados.COD_INSCRI_SUFRAMA!==null)
                    estabelecimento.dados.COD_INSCRI_SUFRAMA = estabelecimento.dados.COD_INSCRI_SUFRAMA.trim();
                if(estabelecimento.dados.COD_REPART_FISCAL!==null)
                    estabelecimento.dados.COD_REPART_FISCAL = estabelecimento.dados.COD_REPART_FISCAL.trim();
                if(estabelecimento.dados.DES_MENS_CABECALHO!==null)
                    estabelecimento.dados.DES_MENS_CABECALHO = estabelecimento.dados.DES_MENS_CABECALHO.trim();
                if(estabelecimento.dados.DES_MENS_PROMOC1!==null)
                    estabelecimento.dados.DES_MENS_PROMOC1 = estabelecimento.dados.DES_MENS_PROMOC1.trim();
                if(estabelecimento.dados.DES_MENS_PROMOC2!==null)
                    estabelecimento.dados.DES_MENS_PROMOC2 = estabelecimento.dados.DES_MENS_PROMOC2.trim();
                if(estabelecimento.dados.COD_BANCO_DEP!==null)
                    estabelecimento.dados.COD_BANCO_DEP = estabelecimento.dados.COD_BANCO_DEP.trim();
                if(estabelecimento.dados.COD_AGENCIA_DEP!==null)
                    estabelecimento.dados.COD_AGENCIA_DEP = estabelecimento.dados.COD_AGENCIA_DEP.trim();
                if(estabelecimento.dados.COD_AGENCIA_DEP!==null)
                    estabelecimento.dados.COD_AGENCIA_DEP = estabelecimento.dados.NRO_CONTA_DEP.trim();
                if(estabelecimento.dados.COD_ESTAB_SCOPE!==null)
                    estabelecimento.dados.COD_ESTAB_SCOPE = estabelecimento.dados.COD_ESTAB_SCOPE.trim();
                if(estabelecimento.dados.COD_EMPRESA_SCOPE!==null)
                    estabelecimento.dados.COD_EMPRESA_SCOPE = estabelecimento.dados.COD_EMPRESA_SCOPE.trim();
                if(estabelecimento.dados.COD_EMPRESA_SCOPE!==null)
                    estabelecimento.dados.COD_EMPRESA_SCOPE = estabelecimento.dados.COD_EMPRESA_SCOPE.trim();
                if(estabelecimento.dados.COD_AGENCIA_BB!==null)
                    estabelecimento.dados.COD_AGENCIA_BB = estabelecimento.dados.COD_AGENCIA_BB.trim();
                if(estabelecimento.dados.NOM_LOCALIZACAO!==null)
                    estabelecimento.dados.NOM_LOCALIZACAO = estabelecimento.dados.NOM_LOCALIZACAO.trim();

                this.estabelecimentoForm.setValue(estabelecimento.dados);
                if(estabelecimento.dados.COD_CIDADE_EST) {
                    this.cadCidadeService.get(estabelecimento.dados.COD_CIDADE_EST).subscribe((cidade:ResponseData<Cidade>)=>{
                        this.estabelecimentoForm.get('COD_CIDADE_EST').setValue(cidade.dados);
                    });
                }

                if(estabelecimento.dados.COD_MATRIZ) {
                    this.cadEstabelecimentoService.get(estabelecimento.dados.COD_MATRIZ).subscribe((estab:ResponseData<Estabelecimento>)=>{
                        this.estabelecimentoForm.get('COD_MATRIZ').setValue(estab.dados);
                    });
                }

                if(estabelecimento.dados.COD_SHOPPING) {
                    this.cadShoppingService.get(estabelecimento.dados.COD_SHOPPING).subscribe((shopping:ResponseData<Shopping>)=>{
                        this.estabelecimentoForm.get('COD_SHOPPING').setValue(shopping.dados);
                    });
                }

                if(estabelecimento.dados.COD_CPU) {
                    this.cadCpuService.get(estabelecimento.dados.COD_CPU).subscribe((cpu:ResponseData<Cpu>)=>{
                        this.estabelecimentoForm.get('COD_CPU').setValue(cpu.dados);
                    });
                }

                
            }
        )
    }

    carregaForm() {
        this.estabelecimentoForm = this.fb.group({
            COD_ESTABELECIMENT: '', 
            DES_ESTABELECIMENT: ['', 
                [
                Validators.required,
                Validators.maxLength(40)
                ]
            ],
            CGC_ESTABELECIMENT: ['', 
                [
                Validators.required,
                Validators.maxLength(14),
                CnpjValidator
                ]
            ],
            NOM_LOGRADOURO: ['', 
                [
                Validators.required,
                Validators.maxLength(30)
                ]
            ],
            NRO_ESTABELECIMENT: ['',
                [
                Validators.required,
                Validators.maxLength(6),
                ]
            ],
            DES_COMPLEMENTO: ['',
                [
                Validators.maxLength(10),
                ]
            ],
            NOM_BAIRRO: ['', 
                [
                Validators.required,
                Validators.maxLength(30)
                ]
            ],
            SGL_UF: ['', 
                [
                Validators.required
                ]
            ],
            NRO_TELEFONE: ['',
                [
                Validators.maxLength(14),
                Validators.minLength(10),
                Validators.pattern(/^[\d]*$/) //Aceita somente números
                ]
            ],
            NRO_FAX: '',
            NRO_TELEX: '',
            COD_CEP: ['',
                [
                Validators.required,
                Validators.maxLength(8),
                Validators.minLength(8),
                Validators.pattern(/^[\d]*$/) //Aceita somente números
                ]
            ],
            COD_CIDADE_EST: ['', 
                [
                Validators.required,
                EhCidadeValidator
                ]
            ],
            NOM_MUNICIPIO: '',
            COD_INSCRIC_ESTADU: ['', 
                [
                Validators.required,
                Validators.maxLength(14)
                ]
            ],
            COD_INSC_MUNICIPAL: ['', 
                [
                Validators.required,
                Validators.maxLength(14)
                ]
            ],
            NRO_JUNTA_COMERCIA: ['',
                [
                Validators.maxLength(20)
                ]
            ],
            DAT_REGISTRO_ESTAB: '',
            NOM_FANTASIA_ESTAB: ['', 
                [
                Validators.required,
                Validators.maxLength(15)
                ]
            ],
            NOM_TITULAR_ESTAB: ['',
                [
                Validators.maxLength(30)
                ]
            ],
            NOM_CONTADOR: ['',
                [
                Validators.maxLength(30)
                ]
            ],
            COD_CRC_CONTADOR: ['',
                [
                Validators.maxLength(20)
                ]
            ],
            SGL_UF_CRC_CONTAD: '',
            IDT_MATRIZ: ['',
                [
                Validators.required
                ]
            ],
            COD_SEGMENTO: ['',
                [
                Validators.required
                ]
            ],
            COD_INSCRI_SUFRAMA: ['',
                [
                Validators.maxLength(20)
                ]
            ],
            COD_REPART_FISCAL: ['',
                [
                Validators.maxLength(20)
                ]
            ],
            COD_MATRIZ: ['', 
                [
                Validators.required,
                EhEstabelecimentoValidator
                ]
            ],
            IDT_CUSTO_ST: ['',
                [
                Validators.required
                ]
            ],
            IDT_LR_MESMAROTA: '',
            IDT_CD_CT: ['',
                [
                Validators.required
                ]
            ],
            COD_VER_NFE: ['',
                [
                Validators.required
                ]
            ],
            IDT_TIP_ESTAB: ['',
                [
                Validators.required
                ]
            ],
            DES_MENS_CABECALHO: ['',
                [
                Validators.maxLength(40)
                ]
            ],
            DES_MENS_PROMOC1: ['',
                [
                Validators.maxLength(40)
                ]
            ],
            DES_MENS_PROMOC2: ['',
                [
                Validators.maxLength(40)
                ]
            ],
            IDC_FAZ_COMPRA: ['',
                [
                Validators.required
                ]
            ],
            PER_NEGOC_ENTRADA: ['',
                [
                Validators.required,
                Validators.max(100),
                Validators.min(0),
                Validators.pattern(/^[\d,]*$/)
                ]
            ],
            NRO_DIAS_NEGOC_PRE: ['',
                [
                Validators.required,
                Validators.max(100),
                Validators.min(0),
                Validators.pattern(/^[\d]*$/)
                ]
            ],
            IDC_LOCAL_COBRANCA: ['',
                [
                Validators.required
                ]
            ],
            LIM_MAIOR_ATRASO: ['',
                [
                Validators.required,
                Validators.max(100),
                Validators.min(0),
                Validators.pattern(/^[\d]*$/)
                ]
            ],
            IDC_CAD_CHEQUE: ['',
                [
                Validators.required
                ]
            ],
            IDC_FRANQUEADA: ['',
                [
                Validators.required
                ]
            ],
            NRO_ULTIMO_SEQ: ['',
                [
                Validators.required,
                Validators.max(9999999999),
                Validators.min(0),
                Validators.pattern(/^[\d]*$/)
                ]
            ], 
            NRO_ULT_CLIENTE: ['',
                [
                Validators.required,
                Validators.max(9999999999),
                Validators.min(0),
                Validators.pattern(/^[\d]*$/)
                ]
            ], 
            NRO_ULT_EMPRESA: ['',
                [
                Validators.required,
                Validators.max(9999999999),
                Validators.min(0),
                Validators.pattern(/^[\d]*$/)
                ]
            ], 
            NRO_ULT_CONTRATO: ['',
                [
                Validators.required,
                Validators.max(9999999999),
                Validators.min(0),
                Validators.pattern(/^[\d]*$/)
                ]
            ], 
            NRO_ULT_PROTOCOLO: ['',
                [
                Validators.required,
                Validators.max(9999999999),
                Validators.min(0),
                Validators.pattern(/^[\d]*$/)
                ]
            ], 
            VLR_REPASSE: ['',
                [
                Validators.required,
                Validators.pattern(/^[\d,]*$/)
                ]
            ],
            COD_BANCO_DEP: ['',
                [
                Validators.maxLength(3)
                ]
            ],
            COD_AGENCIA_DEP: ['',
                [
                Validators.maxLength(4)
                ]
            ],
            NRO_CONTA_DEP: ['',
                [
                Validators.maxLength(10)
                ]
            ],
            COD_FRANQUEADO: '',
            NRO_DIAS_MAQ_IMED: ['',
                [
                Validators.required,
                Validators.max(100),
                Validators.min(0),
                Validators.pattern(/^[\d]*$/)
                ]
            ],
            IDT_CAPTURA_EMAIL:'',
            VLR_LIMITE_SANGRIA: ['',
                [
                Validators.required,
                Validators.pattern(/^[\d,]*$/)
                ]
            ],
            VLR_ABERTURA_PDVS: ['',
                [
                Validators.pattern(/^[\d,]*$/)
                ]
            ],
            VLR_LIMITE_RESSUP: ['',
                [
                Validators.pattern(/^[\d,]*$/)
                ]
            ],
            NRO_PARCELAS_ETQ: ['',
                [
                Validators.pattern(/^[\d]*$/)
                ]
            ],
            VLR_MINIMO_ETQ: ['',
                [
                Validators.pattern(/^[\d,]*$/)
                ]
            ],
            COD_EMPRESA_SCOPE: ['',
                [
                Validators.maxLength(4)
                ]
            ],
            COD_ESTAB_SCOPE: ['',
                [
                Validators.maxLength(4)
                ]
            ],
            COD_CONVENIO_CBO: ['',
                [
                Validators.pattern(/^[\d]*$/)
                ]
            ],
            COD_AGENCIA_BB: ['',
                [
                Validators.maxLength(4)
                ]
            ],
            NRO_ESTAB_BB: ['',
                [
                Validators.pattern(/^[\d]*$/)
                ]
            ],
            COD_CONVENIO_PCA: ['',
                [
                Validators.pattern(/^[\d]*$/)
                ]
            ],
            COD_LOC_BRADESCARD: ['',
                [
                Validators.pattern(/^[\d]*$/)
                ]
            ],
            COD_SBF: '',
            COD_MASTER: '',
            COD_REDE_LOJA: '',
            NRO_LOJA: ['',
                [
                Validators.pattern(/^[\d]*$/)
                ]
            ],
            COD_TERRITORIO: '',
            COD_CIDADE: '',
            COD_LOCALIZACAO: '',
            COD_SHOPPING: ['',
                [
                EhShoppingValidator
                ]
            ],
            IDC_EFETUA_VENDA: ['',
                [
                Validators.required
                ]
            ],
            COD_GRUPO_PRECO: '',
            IDT_TIP_ATEND: ['',
                [
                Validators.required
                ]
            ],
            IDC_TEM_SETOR: ['',
                [
                Validators.required
                ]
            ],
            COD_FORMATO_LOJA: ['',
                [
                Validators.required
                ]
            ],
            COD_REGIAO_LOJA: ['',
                [
                Validators.required
                ]
            ],
            COD_LOCALIZ_CIDADE: ['',
                [
                Validators.required
                ]
            ],
            COD_CONDICAO_ECON: ['',
                [
                Validators.required
                ]
            ],
            COD_CLIMA_LOJA: ['',
                [
                Validators.required
                ]
            ],
            DAT_INAUGURACAO: '',
            DAT_FECHAMENTO: '',
            QTD_METROS_QUADRAD: ['',
                [
                Validators.max(9999.99),
                Validators.min(0),
                Validators.pattern(/^[\d,]*$/)
                ]
            ],
            VLR_AREA_BRUTA: ['',
                [
                Validators.required,
                Validators.max(9999.99),
                Validators.min(0),
                Validators.pattern(/^[\d,]*$/)
                ]
            ],
            NOM_LOCALIZACAO: ['',
                [
                Validators.maxLength(20)
                ]
            ],
            IDT_NOVO_MOL: '',
            IDT_PRODUTO_COMISS: '',
            IDT_FAIXA_COMISSAO: '',
            IDT_DEVOLUCAO: '',
            COD_CPU: '',
            IDC_LOCAL_ENTREGA: ['',
                [
                Validators.required
                ]
            ],
            IDT_TIP_SISTEMA: '',
            IDT_PREMIER_MG: '',
            IDT_CD_PESADOS: '',
            IDT_INFORMA_QTD: '',
            IDT_CANCELA_ITEM: '',
            IDT_SENHA_CAN_ITEM: '',
            IDT_LJ_P2K: '',
            IDT_SAP: ['',
                [
                Validators.required
                ]
            ],
            COD_INSCRICAO_ST: '',
            IDT_REC_LJ_PONTO: '',
            IDT_REC_LJ_RETAGUARDA: '',
            IDT_REC_LJ_AUTOFUNC: '',
            COD_ESTAB: '',
        },{
            validator: [
                IEValidator,
                SuframaValidator,
                RepartFiscalValidator,
                MesmaRotaValidator,
                CdCtValidator
            ]
        });

        /*
        this.estabelecimentoForm.get('COD_ESTABELECIMENT').setValue("0500");
        this.estabelecimentoForm.get('DES_ESTABELECIMENT').setValue("Teste");
        this.estabelecimentoForm.get('CGC_ESTABELECIMENT').setValue("X");
        this.estabelecimentoForm.get('NOM_LOGRADOURO').setValue("Teste");
        this.estabelecimentoForm.get('NRO_ESTABELECIMENT').setValue("123");
        this.estabelecimentoForm.get('NOM_BAIRRO').setValue("Teste");
        this.estabelecimentoForm.get('SGL_UF').setValue("SP");
        this.estabelecimentoForm.get('COD_CEP').setValue("05038090");
        this.estabelecimentoForm.get('COD_SEGMENTO').setValue("1");
        this.estabelecimentoForm.get('COD_INSCRIC_ESTADU').setValue("X");
        this.estabelecimentoForm.get('COD_INSC_MUNICIPAL').setValue("X");
        this.estabelecimentoForm.get('DAT_REGISTRO_ESTAB').setValue(moment("2019-08-19").toISOString());
        this.estabelecimentoForm.get('NOM_FANTASIA_ESTAB').setValue("Teste");
        this.estabelecimentoForm.get('IDT_TIP_ESTAB').setValue("L");
        this.estabelecimentoForm.get('IDT_CUSTO_ST').setValue("N");
        this.estabelecimentoForm.get('IDT_LR_MESMAROTA').setValue("N");
        this.estabelecimentoForm.get('IDT_CD_CT').setValue("N");
        this.estabelecimentoForm.get('COD_VER_NFE').setValue("4.00");

        
        this.estabelecimentoForm.get('IDT_MATRIZ').setValue("N");
        this.estabelecimentoForm.get('IDC_EFETUA_VENDA').setValue("S");
        this.estabelecimentoForm.get('IDC_FAZ_COMPRA').setValue("N");
        this.estabelecimentoForm.get('IDC_LOCAL_ENTREGA').setValue("N");
        this.estabelecimentoForm.get('IDC_LOCAL_COBRANCA').setValue("N");
        this.estabelecimentoForm.get('IDC_CAD_CHEQUE').setValue("S");
        this.estabelecimentoForm.get('IDC_FRANQUEADA').setValue("N");
        this.estabelecimentoForm.get('NRO_ULTIMO_SEQ').setValue("0");
        this.estabelecimentoForm.get('NRO_ULT_CLIENTE').setValue("0");
        this.estabelecimentoForm.get('NRO_ULT_EMPRESA').setValue("0");
        this.estabelecimentoForm.get('NRO_ULT_CONTRATO').setValue("0");
        this.estabelecimentoForm.get('NRO_ULT_PROTOCOLO').setValue("0");
        this.estabelecimentoForm.get('VLR_REPASSE').setValue("0");
        this.estabelecimentoForm.get('VLR_LIMITE_SANGRIA').setValue("0");
        this.estabelecimentoForm.get('PER_NEGOC_ENTRADA').setValue("1");
        this.estabelecimentoForm.get('NRO_DIAS_NEGOC_PRE').setValue("1");
        this.estabelecimentoForm.get('LIM_MAIOR_ATRASO').setValue("30");

        this.estabelecimentoForm.get('NRO_DIAS_MAQ_IMED').setValue("0");
        this.estabelecimentoForm.get('IDT_TIP_ATEND').setValue("M");
        this.estabelecimentoForm.get('IDC_TEM_SETOR').setValue("N");
        this.estabelecimentoForm.get('COD_FORMATO_LOJA').setValue("00");
        this.estabelecimentoForm.get('COD_REGIAO_LOJA').setValue("00");
        this.estabelecimentoForm.get('COD_LOCALIZ_CIDADE').setValue("01");
        this.estabelecimentoForm.get('COD_CONDICAO_ECON').setValue("00");
        this.estabelecimentoForm.get('COD_CLIMA_LOJA').setValue("00");
        this.estabelecimentoForm.get('VLR_AREA_BRUTA').setValue("0");
        this.estabelecimentoForm.get('IDT_SAP').setValue("S");
        */

        this.filteredCidades = this.estabelecimentoForm.get('COD_CIDADE_EST').valueChanges
                .pipe(
                  debounceTime(300),
                  switchMap(value => this.autoCompleteCidadeService.search(this.estabelecimentoForm.get('SGL_UF').value, this.estabelecimentoForm.get('COD_CIDADE_EST').value))
                );

        this.filteredEstabelecimentos = this.estabelecimentoForm.get('COD_MATRIZ').valueChanges
                .pipe(
                  debounceTime(300),
                  switchMap(value => this.autoCompleteEstabService.search(this.estabelecimentoForm.get('COD_MATRIZ').value))
                );

        this.filteredShoppings = this.estabelecimentoForm.get('COD_SHOPPING').valueChanges
                .pipe(
                  debounceTime(300),
                  switchMap(value => this.autoCompleteShoppingService.search(this.estabelecimentoForm.get('COD_SHOPPING').value))
                );
        
        this.filteredCpus = this.estabelecimentoForm.get('COD_CPU').valueChanges
                .pipe(
                  debounceTime(300),
                  switchMap(value => this.autoCompleteCpuService.search(this.estabelecimentoForm.get('COD_CPU').value))
                );

    }

    carregaListas() {
        this.cadUfService.list("",0,50)
            .subscribe(
                ufs => {
                    this.listaUf = ufs.dados.listaRegistros;
                });

        this.cadSegmentoService.list("",0,50)
            .subscribe(
                segmentos => {
                    this.listaSegmento = segmentos.dados.listaRegistros;
                });

        this.cadFranqueadoService.list("",0,50)
            .subscribe(
                franqueados => {
                    this.listaFranqueado = franqueados.dados.listaRegistros;
                });
        
        this.cadSbfService.list("",0,50)
            .subscribe(
                sbfs => {
                    this.listaSbf = sbfs.dados.listaRegistros;
                });
        
        this.cadMasterService.list("",0,50)
            .subscribe(
                masters => {
                    this.listaMaster = masters.dados.listaRegistros;
                });
        
        this.cadRedeLojaService.list("",0,50)
            .subscribe(
                redesLojas => {
                    this.listaRedeLoja = redesLojas.dados.listaRegistros;
                });
        
        this.cadLocalizLojaService.list("",0,50)
            .subscribe(
                localizacoes => {
                    this.listaLocalizacao = localizacoes.dados.listaRegistros;
                });

        this.cadGrupoPrecoService.list("",0,50)
            .subscribe(
                gruposPrecos => {
                    this.listaGrupoPreco = gruposPrecos.dados.listaRegistros;
                }
            );
        
        this.cadFormatoLojaService.list("",0,50)
            .subscribe(
                formatosLojas => {
                    this.listaFormatoLoja = formatosLojas.dados.listaRegistros;
                });

        this.cadRegiaoLojaService.list("",0,50)
            .subscribe(
                regioesLojas => {
                    this.listaRegiaoLoja = regioesLojas.dados.listaRegistros;
                }
            );
        
        this.carregaListaTipAtend()

        this.cadLocalizCidadeService.list("",0,50)
            .subscribe(
                localizCidades => {
                    this.listaLocalizCidade = localizCidades.dados.listaRegistros;
                }
            );
        
        this.cadCondEconService.list("",0,50)
            .subscribe(
                condEcons => {
                    this.listaCondEcon = condEcons.dados.listaRegistros;
                });

        this.cadClimaLojaService.list("",0,50)
            .subscribe(
                climasLojas => {
                    this.listaClimaLoja = climasLojas.dados.listaRegistros;
                }
            );
        this.carregaListaTipSistema()
    }

    carregaListaTipAtend() {
        this.listaTipoAtend = [
            {IDT_TIP_ATEND: 'A', DES_IDT_TIP_ATEND: 'Atendimento assistido'},
            {IDT_TIP_ATEND: 'U', DES_IDT_TIP_ATEND: 'aUto-atendimento'},
            {IDT_TIP_ATEND: 'M', DES_IDT_TIP_ATEND: 'Misto'},
        ];
    }

    carregaListaTipSistema() {
        this.listaTipoSistema = [
            {IDT_TIP_SISTEMA: 'P', DES_TIPO_SISTEMA: 'Próprio'},
            {IDT_TIP_SISTEMA: 'T', DES_TIPO_SISTEMA: 'Terceiro'},
            {IDT_TIP_SISTEMA: 'Y', DES_TIPO_SISTEMA: 'Terceiro-Ecommerce'},
        ];
    }

    mudaUf() {
        this.estabelecimentoForm.get('COD_TERRITORIO').setValue(this.estabelecimentoForm.get('SGL_UF').value);
    }

    mudaCidade() {
        this.estabelecimentoForm.get('COD_CIDADE').setValue(this.estabelecimentoForm.get('COD_CIDADE_EST').value);
    }

    displayCidade(cidade: Cidade) {
        if (cidade) { 
            return cidade.COD_CIDADE + " - " + cidade.NOM_CIDADE
        }
    }

    displayMatriz(estab: Estabelecimento) {
        if (estab) { 
            return estab.COD_ESTABELECIMENT + " - " + estab.DES_ESTABELECIMENT
        }
    }

    displayShopping(shopping: Shopping) {
        if (shopping) { 
            return shopping.COD_SHOPPING + " - " + shopping.NOM_SHOPPING
        }
    }

    displayCpu(cpu: Cpu) {
        if (cpu) { 
            return cpu.COD_CPU + " - " + cpu.NOME_CPU
        }
    }

    voltar() {
        this.router.navigate(['cadastros/cadastro-estabelecimentos']);
    }

    alterar() {
        if(this.estabelecimentoForm.valid && !this.estabelecimentoForm.pending) {
            const newEstabelecimento = this.estabelecimentoForm.getRawValue() as NewEstabelecimento;
            //console.log(newEstabelecimento);
            if(newEstabelecimento.DAT_REGISTRO_ESTAB)
                newEstabelecimento.DAT_REGISTRO_ESTAB = moment(newEstabelecimento.DAT_REGISTRO_ESTAB).format("YYYY-MM-DD");
            
            if(newEstabelecimento.DAT_INAUGURACAO)
                newEstabelecimento.DAT_INAUGURACAO = moment(newEstabelecimento.DAT_INAUGURACAO).format("YYYY-MM-DD");
            
            if(newEstabelecimento.DAT_FECHAMENTO)
                newEstabelecimento.DAT_FECHAMENTO = moment(newEstabelecimento.DAT_FECHAMENTO).format("YYYY-MM-DD");
            
            if(newEstabelecimento.PER_NEGOC_ENTRADA)
                newEstabelecimento.PER_NEGOC_ENTRADA = newEstabelecimento.PER_NEGOC_ENTRADA.replace(",",".");
            
            if(newEstabelecimento.VLR_REPASSE)
                newEstabelecimento.VLR_REPASSE = newEstabelecimento.VLR_REPASSE.replace(",",".");
            
            if(newEstabelecimento.VLR_LIMITE_SANGRIA)
                newEstabelecimento.VLR_LIMITE_SANGRIA = newEstabelecimento.VLR_LIMITE_SANGRIA.replace(",",".");

            if(newEstabelecimento.VLR_ABERTURA_PDVS)
                newEstabelecimento.VLR_ABERTURA_PDVS = newEstabelecimento.VLR_ABERTURA_PDVS.replace(",",".");
            
            if(newEstabelecimento.VLR_LIMITE_RESSUP)
                newEstabelecimento.VLR_LIMITE_RESSUP = newEstabelecimento.VLR_LIMITE_RESSUP.replace(",",".");
            
            if(newEstabelecimento.VLR_MINIMO_ETQ)
                newEstabelecimento.VLR_MINIMO_ETQ = newEstabelecimento.VLR_MINIMO_ETQ.replace(",",".");
            
            if(newEstabelecimento.QTD_METROS_QUADRAD)
                newEstabelecimento.QTD_METROS_QUADRAD = newEstabelecimento.QTD_METROS_QUADRAD.replace(",",".");
            
            if(newEstabelecimento.VLR_AREA_BRUTA)
                newEstabelecimento.VLR_AREA_BRUTA = newEstabelecimento.VLR_AREA_BRUTA.replace(",",".");
            
                ///console.log();
            this.cadEstabelecimentoService
                .alterar(newEstabelecimento)
                .subscribe(
                    () => {
                        this.router.navigate(['cadastros/cadastro-estabelecimentos']);
                        this.alertService.success("Estabelecimento alterado com sucesso.",10000, false);
                    },
                    err => {
                        console.log(err);
                        this.router.navigate(['cadastros/cadastro-estabelecimentos']);
                        this.alertService.danger("ERRO! Nao foi possivel alterar o Estabelecimento.",10000,false);
                    }
                );
        }

    }


    
}
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CodigoEstabelecimentoJaExisteValidatorService } from "../codigo-estabelecimento-ja-existe.validator.service";
import { CadastroEstabelecimentosService } from "../cadastro-estabelecimentos.service";
import { Router } from "@angular/router";
import { AlertService } from "src/app/shared/components/alert/alert.service";
import { NewEstabelecimento } from "../new-estabelecimento";
import { CnpjValidator } from "src/app/shared/validators/cnpj.validator";
import { CadastroUfsService } from "../../cadastro-ufs/cadastro-ufs.service";
import { Observable } from "rxjs";
import { ResponseData } from "src/app/shared/interfaces/response-data";
import { ListData } from "src/app/shared/interfaces/list-data";
import { Cidade } from "src/app/shared/components/autocomplete/cidade/auto-complete-cidade";
import { debounceTime, switchMap } from "rxjs/operators";
import { AutoCompleteCidadeService } from "src/app/shared/components/autocomplete/cidade/auto-complete-cidade.service";
import { IEValidator } from "src/app/cadastros/cadastro-estabelecimentos/ie.validator";
import * as moment from 'moment';
import { CadastroSegmentosEconomicosService } from "../../cadastro-segmentos-economicos/cadastro-segmentos-economicos.service";
import { SuframaValidator } from "src/app/cadastros/cadastro-estabelecimentos/suframa.validator";
import { RepartFiscalValidator } from "src/app/cadastros/cadastro-estabelecimentos/repart-fiscal.validator";
import { Estabelecimento } from "../cadastro-estabelecimentos";
import { AutoCompleteLojaService } from "src/app/shared/components/autocomplete/loja/auto-complete-loja.service";
import { MesmaRotaValidator } from "../mesma-rota.validator";
import { CdCtValidator } from "../cd-ct.validator";
import { CadastroFranqueadosService } from "../../cadastro-franqueados/cadastro-franqueados.service";
import { CadastroConjuntosEmpresariaisService } from "../../cadastro-conjuntos-empresariais/cadastro-conjuntos-empresariais.service";
import { CadastroGruposEmpresariaisService } from "../../cadastro-grupos-empresariais/cadastro-grupos-empresariais.service";
import { CadastroRedesLojasService } from "../../cadastro-redes-lojas/cadastro-redes-lojas.service";
import { EhCidadeValidator } from "src/app/shared/validators/eh-cidade.validator";
import { EhEstabelecimentoValidator } from "src/app/shared/validators/eh-estabelecimento.validator";
import { CadastroLocalizacoesLojasService } from "../../cadastro-localizacoes-lojas/cadastro-localizacoes-lojas.service";
import { Shopping } from "../../cadastro-shoppings/cadastro-shoppings";
import { AutoCompleteShoppingService } from "src/app/shared/components/autocomplete/shopping/auto-complete-shopping.service";
import { EhShoppingValidator } from "src/app/shared/validators/eh-shopping.validator";
import { CadastroGruposPrecosService } from "../../cadastro-grupos-precos/cadastro-grupos-precos.service";
import { CadastroFormatosLojasService } from "../../cadastro-formatos-lojas/cadastro-formatos-lojas.service";
import { CadastroRegioesLojasService } from "../../cadastro-regioes-lojas/cadastro-regioes-lojas.service";
import { CadastroLocalizacoesCidadesService } from "../../cadastro-localizacoes-cidades/cadastro-localizacoes-cidades.service";
import { CadastroCondicoesEconomicasLojasService } from "../../cadastro-condicoes-economicas-lojas/cadastro-condicoes-economicas-lojas.service";
import { CadastroClimasLojasService } from "../../cadastro-climas-lojas/cadastro-climas-lojas.service";
import { Cpu } from "../../cadastro-cpus/cadastro-cpus";
import { AutoCompleteCpuService } from "src/app/shared/components/autocomplete/cpu/auto-complete-cpu.service";
import { CadastroCidadesService } from "../../cadastro-cidades/cadastro-cidades.service";

@Component({
    templateUrl: "./inclusao-estabelecimento.component.html",
    providers: [ 
        CodigoEstabelecimentoJaExisteValidatorService
    ]
})
export class InclusaoEstabelecimentoComponent implements OnInit{
    
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

    constructor(private fb: FormBuilder,
        private estabelecimentoJAExisteValidatorService: CodigoEstabelecimentoJaExisteValidatorService,
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
        private router: Router,
        private alertService: AlertService) {}

    ngOnInit(): void {
        this.carregaForm();
        this.carregaListas();
    }

    carregaForm() {
        this.estabelecimentoForm = this.fb.group({
            COD_ESTABELECIMENT: ['', 
                [
                Validators.required,
                Validators.maxLength(4)
                ],
                this.estabelecimentoJAExisteValidatorService.checkEstabelecimentoJaExiste()
            ],
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
            ]
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
        this.cadCidadeService.get("112").subscribe(cidade=>{
            this.estabelecimentoForm.get('COD_CIDADE_EST').setValue(cidade.dados);
        });
        this.estabelecimentoForm.get('COD_INSCRIC_ESTADU').setValue("X");
        this.estabelecimentoForm.get('COD_INSC_MUNICIPAL').setValue("X");
        this.estabelecimentoForm.get('DAT_REGISTRO_ESTAB').setValue(moment("2019-08-19").toISOString());
        this.estabelecimentoForm.get('NOM_FANTASIA_ESTAB').setValue("Teste");
        this.estabelecimentoForm.get('IDT_TIP_ESTAB').setValue("L");
        this.estabelecimentoForm.get('IDT_CUSTO_ST').setValue("N");
        this.estabelecimentoForm.get('IDT_LR_MESMAROTA').setValue("N");
        this.estabelecimentoForm.get('IDT_CD_CT').setValue("N");
        this.estabelecimentoForm.get('COD_VER_NFE').setValue("4.00");
        */
        
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

    incluir() {
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
                .incluir(newEstabelecimento)
                .subscribe(
                    () => {
                        this.router.navigate(['cadastros/cadastro-estabelecimentos']);
                        this.alertService.success("Estabelecimento incluido com sucesso.",10000, false);
                    },
                    err => {
                        console.log(err);
                        this.router.navigate(['cadastros/cadastro-estabelecimentos']);
                        this.alertService.danger("ERRO! Nao foi possivel incluir o Estabelecimento.",10000,false);
                    }
                );
        }

    }

    
}
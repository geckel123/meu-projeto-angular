import { Component, OnInit } from "@angular/core";
import { CadastroEstabelecimentosService } from "../cadastro-estabelecimentos.service";
import { Observable } from "rxjs";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Estabelecimento } from "../cadastro-estabelecimentos";
import { CadastroCidadesService } from "../../cadastro-cidades/cadastro-cidades.service";
import { CadastroUfsService } from "../../cadastro-ufs/cadastro-ufs.service";
import { CadastroRedesLojasService } from "../../cadastro-redes-lojas/cadastro-redes-lojas.service";
import { CadastroConjuntosEmpresariaisService } from "../../cadastro-conjuntos-empresariais/cadastro-conjuntos-empresariais.service";
import { CadastroGruposEmpresariaisService } from "../../cadastro-grupos-empresariais/cadastro-grupos-empresariais.service";
import { CadastroFranqueadosService } from "../../cadastro-franqueados/cadastro-franqueados.service";
import { CadastroLocalizacoesLojasService } from "../../cadastro-localizacoes-lojas/cadastro-localizacoes-lojas.service";
import { CadastroShoppingsService } from "../../cadastro-shoppings/cadastro-shoppings.service";
import { CadastroGruposPrecosService } from "../../cadastro-grupos-precos/cadastro-grupos-precos.service";
import { CadastroFormatosLojasService } from "../../cadastro-formatos-lojas/cadastro-formatos-lojas.service";
import { CadastroRegioesLojasService } from "../../cadastro-regioes-lojas/cadastro-regioes-lojas.service";
import { CadastroLocalizacoesCidadesService } from "../../cadastro-localizacoes-cidades/cadastro-localizacoes-cidades.service";
import { CadastroCondicoesEconomicasLojasService } from "../../cadastro-condicoes-economicas-lojas/cadastro-condicoes-economicas-lojas.service";
import { CadastroClimasLojasService } from "../../cadastro-climas-lojas/cadastro-climas-lojas.service";
import { CadastroSegmentosEconomicosService } from "../../cadastro-segmentos-economicos/cadastro-segmentos-economicos.service";
import { CadastroCpusService } from "../../cadastro-cpus/cadastro-cpus.service";
import { ResponseData } from "src/app/shared/interfaces/response-data";
import { AlertService } from "src/app/shared/components/alert/alert.service";

@Component({
    templateUrl: "./delecao-estabelecimento.component.html"
})
export class DelecaoEstabelecimentoComponent implements OnInit{
    
    constructor(private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private cadEstabService: CadastroEstabelecimentosService,
        private cadCidadeService: CadastroCidadesService,
        private cadUfService:CadastroUfsService,
        private cadRedeLojaService: CadastroRedesLojasService,
        private cadSbfService: CadastroConjuntosEmpresariaisService,
        private cadMasterService: CadastroGruposEmpresariaisService,
        private cadFranqueadoService: CadastroFranqueadosService,
        private cadLocalLojaService: CadastroLocalizacoesLojasService,
        private cadShoppingService: CadastroShoppingsService,
        private cadGrupoPrecoService: CadastroGruposPrecosService,
        private cadFormatoLojaService: CadastroFormatosLojasService,
        private cadRegiaoLojaService: CadastroRegioesLojasService,
        private cadLocalCidadeService: CadastroLocalizacoesCidadesService,
        private cadCondEconLojaService: CadastroCondicoesEconomicasLojasService,
        private cadClimaLojaService: CadastroClimasLojasService,
        private cadSegEconService: CadastroSegmentosEconomicosService,
        private cadCpuService: CadastroCpusService) {}

    estabelecimento$:Observable<ResponseData<Estabelecimento>>;

    estabelecimento:Estabelecimento;

    desTipoAtendimento: string;
    desTipoEstabelecimento: string;
    desTipoSistema: string;
    nomeCidade: string;
    nomeUf: string;
    nomeRedeLoja: string;
    nomeSbf: string;
    nomeMaster: string;
    nomeFranqueado: string;
    desLocalizacaoLoja: string;
    nomeShopping: string;
    desGrupoPreco: string;
    nomeFormatoLoja: string;
    nomeRegiaoLoja: string;
    nomeLocalizacaoCidade: string;
    nomeCondicaoEcon: string;
    nomeClimaLoja: string;
    desSegmentoEcon: string;


    ngOnInit(): void {
        this.estabelecimento$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
              return this.cadEstabService.get(params.get('id'));
            })
          );
        this.loadData();
        this.carregaAuxiliares()
    }

    loadData(): void {
        this.estabelecimento$.subscribe(
            estabelecimento => {
                this.estabelecimento = estabelecimento.dados;
            }
        )
    }

    voltar() {
        this.router.navigate(['cadastros/cadastro-estabelecimentos']);
    }

    deletar() {
        if(confirm(`Deseja realmente deletar o Estabelecimento ${this.estabelecimento.COD_ESTABELECIMENT} - ${this.estabelecimento.DES_ESTABELECIMENT.trim()}?` )) {
            
            this.cadEstabService
                .deletar(this.estabelecimento.COD_ESTABELECIMENT)
                .subscribe(
                    () => {
                        this.router.navigate(['cadastros/cadastro-estabelecimentos']);
                        this.alertService.success("Estabelecimento deletado com sucesso.",10000, false);
                    },
                    err => {
                        console.log(err);
                        this.router.navigate(['cadastros/cadastro-estabelecimentos']);
                        this.alertService.danger("ERRO! Nao foi possivel deletar o Estabelecimento.");
                    }
                );
        }
    }

    carregaAuxiliares(): void {
        this.estabelecimento$.subscribe(
            estabelecimento => {
                this.estabelecimento=estabelecimento.dados;
                this.carregaDescricoes();
                
            },
            error => {
                console.log(error);
            }
        );
    }

    carregaDescricoes(): void {
        this.carregaTipoEstabelecimento();
        this.carregaNomeCidade();
        this.carregaNomeUf();
        this.carregaTipoAtendimento();
        this.carregaTipoSistema();
        this.carregaNomeRedeLoja();
        this.carregaNomeSbf();
        this.carregaNomeMaster();
        this.carregaNomeFranqueado();
        this.carregaDesLocalizacaoLoja();
        this.carregaNomeShopping();
        this.carregaDesGrupoPreco();
        this.carregaNomeFormatoLoja();
        this.carregaNomeRegiaoLoja();
        this.carregaNomeLocalizacaoCidade();
        this.carregaNomeCondicaoEcon();
        this.carregaNomeClimaLoja();
        this.carregaDesSegmentoEcon();
        
    }

    carregaNomeSbf(): void {
        if(this.estabelecimento.COD_SBF!== null) {
            this.cadSbfService.get(this.estabelecimento.COD_SBF)
            .subscribe(
                sbf => {
                    this.nomeSbf=sbf.dados.NOM_SBF;
                },
                error => {
                    console.log(error);
                }
                
            );
        } else {
            this.nomeSbf="";
        }
        
    }

    carregaNomeMaster(): void {
        if(this.estabelecimento.COD_MASTER !== null) {
            this.cadMasterService.get(this.estabelecimento.COD_MASTER)
                .subscribe(
                    master => {
                        this.nomeMaster=master.dados.NOM_MASTER;
                    },
                    error => {
                        console.log(error);
                    }
                    
                );
        } else {
            this.nomeMaster="";
        }
    }

    carregaNomeFranqueado(): void {
        if(this.estabelecimento.COD_FRANQUEADO !== null) {
            this.cadFranqueadoService.get(this.estabelecimento.COD_FRANQUEADO)
            .subscribe(
                franqueado => {
                    this.nomeFranqueado=franqueado.dados.NOM_FRANQUEADO;
                },
                error => {
                    console.log(error);
                }
                
            );
        } else {
            this.nomeFranqueado="";
        }
        
    }

    carregaDesLocalizacaoLoja(): void {
        if(this.estabelecimento.COD_LOCALIZACAO !== null) {
            this.cadLocalLojaService.get(this.estabelecimento.COD_LOCALIZACAO)
                .subscribe(
                    localLoja => {
                        this.desLocalizacaoLoja=localLoja.dados.DES_LOCALIZACAO;
                    },
                    error => {
                        console.log(error);
                    }
                    
                );
        } else {
            this.desLocalizacaoLoja="";
        }
    }

    carregaNomeShopping(): void {
        if(this.estabelecimento.COD_SHOPPING !== null) {
            this.cadShoppingService.get(this.estabelecimento.COD_SHOPPING)
                .subscribe(
                    shopping => {
                        this.nomeShopping=shopping.dados.NOM_SHOPPING;
                    },
                    error => {
                        console.log(error);
                    }
                    
                );
        } else {
            this.nomeShopping="";
        }
    }

    carregaDesGrupoPreco(): void {
        if(this.estabelecimento.COD_GRUPO_PRECO !== null) {
            this.cadGrupoPrecoService.get(this.estabelecimento.COD_GRUPO_PRECO)
                .subscribe(
                    grupoPreco => {
                        this.desGrupoPreco=grupoPreco.dados.DES_GRUPO;
                    },
                    error => {
                        console.log(error);
                    }
                    
                );
        } else {
            this.desGrupoPreco="";
        }
    }

    carregaNomeFormatoLoja(): void {
        if(this.estabelecimento.COD_FORMATO_LOJA !== null) {
            this.cadFormatoLojaService.get(this.estabelecimento.COD_FORMATO_LOJA)
                .subscribe(
                    formatoLoja => {
                        this.nomeFormatoLoja=formatoLoja.dados.NOM_FORMATO_LOJA;
                    },
                    error => {
                        console.log(error);
                    }
                );
        } else {
            this.nomeFormatoLoja="";
        }

    }

    carregaNomeRegiaoLoja(): void {
        if(this.estabelecimento.COD_REGIAO_LOJA !== null) {
            this.cadRegiaoLojaService.get(this.estabelecimento.COD_REGIAO_LOJA)
                .subscribe(
                    regiaoLoja => {
                        this.nomeRegiaoLoja=regiaoLoja.dados.NOM_REGIAO_LOJA;
                    },
                    error => {
                        console.log(error);
                    }
                );
        } else {
            this.nomeRegiaoLoja="";
        }
    }

    carregaNomeLocalizacaoCidade(): void {
        if(this.estabelecimento.COD_LOCALIZ_CIDADE !== null) {
            this.cadLocalCidadeService.get(this.estabelecimento.COD_LOCALIZ_CIDADE)
                .subscribe(
                    localCidade => {
                        this.nomeLocalizacaoCidade=localCidade.dados.NOM_LOCALIZ_CIDADE;
                    },
                    error => {
                        console.log(error);
                    }
                );
        } else {
            this.nomeLocalizacaoCidade="";
        }
    }

    carregaNomeCondicaoEcon(): void {
        if(this.estabelecimento.COD_CONDICAO_ECON !== null) {
            this.cadCondEconLojaService.get(this.estabelecimento.COD_CONDICAO_ECON)
                .subscribe(
                    condEcon => {
                        this.nomeCondicaoEcon=condEcon.dados.NOM_CONDICAO_ECON;
                    },
                    error => {
                        console.log(error);
                    }
                );
        } else {
            this.nomeCondicaoEcon="";
        }
    }

    carregaNomeClimaLoja(): void {
        if(this.estabelecimento.COD_CLIMA_LOJA !== null) {
        this.cadClimaLojaService.get(this.estabelecimento.COD_CLIMA_LOJA)
            .subscribe(
                climaLoja => {
                    this.nomeClimaLoja=climaLoja.dados.NOM_CLIMA_LOJA;
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            this.nomeClimaLoja="";
        }
    }

    carregaDesSegmentoEcon(): void {
        if(this.estabelecimento.COD_SEGMENTO !== null) {
            this.cadSegEconService.get(this.estabelecimento.COD_SEGMENTO)
                .subscribe(
                    segmentoEcon => {
                        this.desSegmentoEcon=segmentoEcon.dados.DES_SEGMENTO;
                    },
                    error => {
                        console.log(error);
                    }
                );
        } else {
            this.desSegmentoEcon="";
        }
    }

    carregaNomeRedeLoja(): void {
        if(this.estabelecimento.COD_REDE_LOJA !== null) {
            this.cadRedeLojaService.get(this.estabelecimento.COD_REDE_LOJA)
                .subscribe(
                    redeLoja => {
                        this.nomeRedeLoja=redeLoja.dados.NOM_REDE_LOJA;
                    },
                    error => {
                        console.log(error);
                    }
                );
        } else {
            this.nomeRedeLoja="";
        }
    }

    carregaNomeUf(): void {
        if(this.estabelecimento.COD_TERRITORIO !== null) {
            this.cadUfService.get(this.estabelecimento.COD_TERRITORIO)
                .subscribe(
                    uf => {
                        this.nomeUf=uf.dados.NOM_UF;
                    },
                    error => {
                        console.log(error);
                    }
                );
        } else {
            this.nomeUf="";
        }
    }

    carregaNomeCidade(): void {
        if(this.estabelecimento.COD_CIDADE_EST) {
            this.cadCidadeService.get(this.estabelecimento.COD_CIDADE_EST)
                .subscribe(
                    cidade => {
                        this.nomeCidade=cidade.dados.NOM_CIDADE;
                    },
                    error => {
                        console.log(error);
                    }
                );
        } else {
            this.nomeCidade="";
        }
    }

    carregaTipoEstabelecimento(): void {
        switch (this.estabelecimento.IDT_TIP_ESTAB) {
            case 'D':
                this.desTipoEstabelecimento = 'Deposito';
                break;
            case 'L':
                this.desTipoEstabelecimento = 'Loja';
                break;
            case 'M':
                this.desTipoEstabelecimento = 'Matriz';
                break;
            case 'V':
                this.desTipoEstabelecimento = 'Loja Virtual';
                break;
            case 'S':
                this.desTipoEstabelecimento = 'Sac';
                break;
            case 'E':
                this.desTipoEstabelecimento = 'Entreposto';
                break;
            case 'C':
                this.desTipoEstabelecimento = 'Cd';
                break;
            default:
                this.desTipoEstabelecimento = '';
        }
    }

    carregaTipoAtendimento(): void {
        switch (this.estabelecimento.IDT_TIP_ATEND) {
            case 'A':
                this.desTipoAtendimento = 'Atendimento assistido';
                break;
            case 'U':
                this.desTipoAtendimento = 'aUto-atendimento';
                break;
            case 'M':
                this.desTipoAtendimento = 'Misto';
                break;
            default:
                this.desTipoAtendimento = '';
        }
    }

    carregaTipoSistema(): void {
        switch (this.estabelecimento.IDT_TIP_SISTEMA) {
            case 'P':
                this.desTipoSistema = 'Proprio';
                break;
            case 'T':
                this.desTipoSistema = 'Terceiro';
                break;
            case 'Y':
                this.desTipoSistema = 'Terceiro-Ecommerce';
                break;
            default:
                this.desTipoSistema = '';
        }
    }
    
}
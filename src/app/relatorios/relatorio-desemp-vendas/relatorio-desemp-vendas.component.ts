import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { dateRangeValidatorFactory } from 'src/app/shared/validators/date-range.validator';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AutoCompleteLojaService } from 'src/app/shared/components/autocomplete/loja/auto-complete-loja.service';
import { RelatorioDesempVendasService } from './relatorio-desemp-vendas.service';
import { MapDiario, Diario, FuncaoLoja, ListFunc, MapFunc, DiarioSemSetor, MapDiarioSemSetor } from './relatorio-desemp-vendas';
import { ResponseData } from 'src/app/shared/interfaces/response-data';
import { ListData } from 'src/app/shared/interfaces/list-data';
import { Estabelecimento } from 'src/app/cadastros/cadastro-estabelecimentos/cadastro-estabelecimentos';


@Component({
    templateUrl: "./relatorio-desemp-vendas.component.html",
    styleUrls: ['./relatorio-desemp-vendas.component.css']
})
export class RelatorioDesempVendasComponent implements OnInit{

    defaultForm: FormGroup;
    results: any;
    noresult: boolean = false;
    maximoDiasPeriodo: number = 31;
    filteredLojas: Observable<ResponseData<ListData<Estabelecimento>>>;
    mapDiario: MapDiario;
    mapDiarioSemSetor: MapDiarioSemSetor;
    mapFunc: MapFunc[];
    mapSetor: ListFunc[];
    mapVendedor: ListFunc[];
    totVendedor: ListFunc;
    mapGerente: ListFunc[];
    totGerente:ListFunc;
    totGeral: ListFunc;
    totGeralSemSetor: ListFunc;
    relDiario: boolean;
    relDiarioSemSetor: boolean;
    lojaFiltro: string;
    datIniFiltro: Date;
    datFimFiltro: Date;

    constructor(private fb: FormBuilder, 
                private relatorioDesempVendasService: RelatorioDesempVendasService,
                private autoCompleteLojaService: AutoCompleteLojaService) {}

    ngOnInit(): void {
        this.defaultForm = this.fb.group({
            dataIniInput: ['', 
                [
                Validators.required
                ]
            ],
            dataFimInput: ['', 
                [
                Validators.required
                ]
            ],
            tipoRelatInput: ['',
                [
                Validators.required
                ]
            ],
            idcTemSetorInput: [''],
            lojaInput: ['', 
                [
                Validators.required
                ]
            ]
        },{
            validator: [
                dateRangeValidatorFactory(this.maximoDiasPeriodo)
            ]
        });

        this.filteredLojas = this.defaultForm.get('lojaInput').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => {
            const result = this.autoCompleteLojaService.search(this.defaultForm.get('lojaInput').value);
            return result;
        })
      );

    }

    displayFn(loja: Estabelecimento) {
        if(this.defaultForm && loja.IDC_TEM_SETOR) {
            this.defaultForm.get('idcTemSetorInput').setValue(loja.IDC_TEM_SETOR);
            console.log(this.defaultForm.get('idcTemSetorInput').value);
        }
        
        if (loja.COD_ESTABELECIMENT) { 
            
            return loja.COD_ESTABELECIMENT; 
        }
      }

    search() {
        if(this.defaultForm.valid && !this.defaultForm.pending) {

            const dataIni = this.defaultForm.get('dataIniInput').value;
            const dataFim = this.defaultForm.get('dataFimInput').value;
            var loja = this.defaultForm.get('lojaInput').value;

            const tipoRelat = this.defaultForm.get('tipoRelatInput').value;
            const idcTemSetor = "S";//this.defaultForm.get('idcTemSetorInput').value;

            if(loja.codEstabeleciment) {
                loja = loja.codEstabeleciment;
            }

            this.lojaFiltro = loja;
            this.datIniFiltro = dataIni;
            this.datFimFiltro = dataFim;

            this.noresult = false;
            this.results = null;

            
            this.relatorioDesempVendasService
            .search(dataIni,dataFim,loja,idcTemSetor,tipoRelat)
            .subscribe((res:any) => {
                    if(res == null){
                        this.noresult = true;
                    } else {
                        this.results = res;
                        console.log(this.results);
                        if(this.results.relComSet) {
                            this.preparaDadosRelComSet()
                        } else if(this.results.relSemSet){
                            this.preparaDadosRelSemSet()
                        }
                        
                        
                    }       
                },err => {
                    console.log(err);
                }
            );
        }

    }

    preparaDadosRelSemSetTotGeral() {
        var datOperacao5 = new Date(this.results.relSemSet.totGeral.datOperacao);
        var matrFuncSetor5 = this.results.relSemSet.totGeral.matrFuncSetor;
        var nomFunc5 = this.results.relSemSet.totGeral.nomFunc;
        var codFuncao5 = this.results.relSemSet.totGeral.codFuncao;
        var nomSetor5 = this.results.relSemSet.totGeral.nomSetor;
        var vlrOperacao5 = this.results.relSemSet.totGeral.vlrOperacao;
        var vlrOperacaoSemGift5 = this.results.relSemSet.totGeral.vlrOperacaoSemGift;
        var nroAtend5 = this.results.relSemSet.totGeral.nroAtend;
        var qtdItem5 = this.results.relSemSet.totGeral.qtdItem;
        var qtdVendas5 = this.results.relSemSet.totGeral.qtdVendas;
        var qtdMediaItem5 = this.results.relSemSet.totGeral.qtdMediaItem;
        var vlrMedioItem5 = this.results.relSemSet.totGeral.vlrMedioItem;
        var vlrComissao5 = this.results.relSemSet.totGeral.vlrComissao;
        var vlrVendaBru5 = this.results.relSemSet.totGeral.vlrVendaBru;
        var vlrVendaLiq5 = this.results.relSemSet.totGeral.vlrVendaLiq;
        var vlrMedVenda5 = this.results.relSemSet.totGeral.vlrMedVenda;
        var funcaoLoja5:FuncaoLoja = null;
        var listFuncGeral:ListFunc = new ListFunc(datOperacao5,
                                                matrFuncSetor5,
                                                nomFunc5,
                                                codFuncao5,
                                                nomSetor5,
                                                vlrOperacao5,
                                                vlrOperacaoSemGift5,
                                                nroAtend5,
                                                qtdItem5,
                                                qtdVendas5,
                                                qtdMediaItem5,
                                                vlrMedioItem5,
                                                vlrComissao5,
                                                vlrVendaBru5,
                                                vlrVendaLiq5,
                                                vlrMedVenda5,
                                                funcaoLoja5);
        this.totGeralSemSetor = listFuncGeral;
    }

    preparaDadosRelSemSetVendedores() {
        var contador5 = 0;
        var arrMapVendedor:ListFunc[] = [];

        for(var key5 in this.results.relSemSet.listVendedor) {
            var datOperacao5 = new Date(this.results.relSemSet.listVendedor[key5].datOperacao);
            var matrFuncSetor5 = this.results.relSemSet.listVendedor[key5].matrFuncSetor;
            var nomFunc5 = this.results.relSemSet.listVendedor[key5].nomFunc;
            var codFuncao5 = this.results.relSemSet.listVendedor[key5].codFuncao;
            var nomSetor5 = this.results.relSemSet.listVendedor[key5].nomSetor;
            var vlrOperacao5 = this.results.relSemSet.listVendedor[key5].vlrOperacao;
            var vlrOperacaoSemGift5 = this.results.relSemSet.listVendedor[key5].vlrOperacaoSemGift;
            var nroAtend5 = this.results.relSemSet.listVendedor[key5].nroAtend;
            var qtdItem5 = this.results.relSemSet.listVendedor[key5].qtdItem;
            var qtdVendas5 = this.results.relSemSet.listVendedor[key5].qtdVendas;
            var qtdMediaItem5 = this.results.relSemSet.listVendedor[key5].qtdMediaItem;
            var vlrMedioItem5 = this.results.relSemSet.listVendedor[key5].vlrMedioItem;
            var vlrComissao5 = this.results.relSemSet.listVendedor[key5].vlrComissao;
            var vlrVendaBru5 = this.results.relSemSet.listVendedor[key5].vlrVendaBru;
            var vlrVendaLiq5 = this.results.relSemSet.listVendedor[key5].vlrVendaLiq;
            var vlrMedVenda5 = this.results.relSemSet.listVendedor[key5].vlrMedVenda;
            var funcaoLoja5:FuncaoLoja = null;
            var listFuncVendedor:ListFunc = new ListFunc(datOperacao5,
                                                    matrFuncSetor5,
                                                    nomFunc5,
                                                    codFuncao5,
                                                    nomSetor5,
                                                    vlrOperacao5,
                                                    vlrOperacaoSemGift5,
                                                    nroAtend5,
                                                    qtdItem5,
                                                    qtdVendas5,
                                                    qtdMediaItem5,
                                                    vlrMedioItem5,
                                                    vlrComissao5,
                                                    vlrVendaBru5,
                                                    vlrVendaLiq5,
                                                    vlrMedVenda5,
                                                    funcaoLoja5);
            arrMapVendedor[contador5] = listFuncVendedor;
            contador5++;
        }

        var datOperacao = new Date(this.results.relSemSet.totVendedor.datOperacao);
        var matrFuncSetor = this.results.relSemSet.totVendedor.matrFuncSetor;
        var nomFunc = this.results.relSemSet.totVendedor.nomFunc;
        var codFuncao = this.results.relSemSet.totVendedor.codFuncao;
        var nomSetor = this.results.relSemSet.totVendedor.nomSetor;
        var vlrOperacao = this.results.relSemSet.totVendedor.vlrOperacao;
        var vlrOperacaoSemGift = this.results.relSemSet.totVendedor.vlrOperacaoSemGift;
        var nroAtend = this.results.relSemSet.totVendedor.nroAtend;
        var qtdItem = this.results.relSemSet.totVendedor.qtdItem;
        var qtdVendas = this.results.relSemSet.totVendedor.qtdVendas;
        var qtdMediaItem = this.results.relSemSet.totVendedor.qtdMediaItem;
        var vlrMedioItem = this.results.relSemSet.totVendedor.vlrMedioItem;
        var vlrComissao = this.results.relSemSet.totVendedor.vlrComissao;
        var vlrVendaBru = this.results.relSemSet.totVendedor.vlrVendaBru;
        var vlrVendaLiq = this.results.relSemSet.totVendedor.vlrVendaLiq;
        var vlrMedVenda = this.results.relSemSet.totVendedor.vlrMedVenda;
        var funcaoLoja:FuncaoLoja = null;
        var listFuncTotVendedor:ListFunc = new ListFunc(datOperacao,
                                                matrFuncSetor,
                                                nomFunc,
                                                codFuncao,
                                                nomSetor,
                                                vlrOperacao,
                                                vlrOperacaoSemGift,
                                                nroAtend,
                                                qtdItem,
                                                qtdVendas,
                                                qtdMediaItem,
                                                vlrMedioItem,
                                                vlrComissao,
                                                vlrVendaBru,
                                                vlrVendaLiq,
                                                vlrMedVenda,
                                                funcaoLoja);
        this.totVendedor = listFuncTotVendedor;

        this.mapVendedor = arrMapVendedor;

    }
    
    preparaDadosRelSemSetGerentes() {
        var contador5 = 0;
        var arrMapGerente:ListFunc[] = [];

        for(var key5 in this.results.relSemSet.listGerente) {
            var datOperacao5 = new Date(this.results.relSemSet.listGerente[key5].datOperacao);
            var matrFuncSetor5 = this.results.relSemSet.listGerente[key5].matrFuncSetor;
            var nomFunc5 = this.results.relSemSet.listGerente[key5].nomFunc;
            var codFuncao5 = this.results.relSemSet.listGerente[key5].codFuncao;
            var nomSetor5 = this.results.relSemSet.listGerente[key5].nomSetor;
            var vlrOperacao5 = this.results.relSemSet.listGerente[key5].vlrOperacao;
            var vlrOperacaoSemGift5 = this.results.relSemSet.listGerente[key5].vlrOperacaoSemGift;
            var nroAtend5 = this.results.relSemSet.listGerente[key5].nroAtend;
            var qtdItem5 = this.results.relSemSet.listGerente[key5].qtdItem;
            var qtdVendas5 = this.results.relSemSet.listGerente[key5].qtdVendas;
            var qtdMediaItem5 = this.results.relSemSet.listGerente[key5].qtdMediaItem;
            var vlrMedioItem5 = this.results.relSemSet.listGerente[key5].vlrMedioItem;
            var vlrComissao5 = this.results.relSemSet.listGerente[key5].vlrComissao;
            var vlrVendaBru5 = this.results.relSemSet.listGerente[key5].vlrVendaBru;
            var vlrVendaLiq5 = this.results.relSemSet.listGerente[key5].vlrVendaLiq;
            var vlrMedVenda5 = this.results.relSemSet.listGerente[key5].vlrMedVenda;
            var funcaoLoja5:FuncaoLoja = null;
            var listFuncGerente:ListFunc = new ListFunc(datOperacao5,
                                                    matrFuncSetor5,
                                                    nomFunc5,
                                                    codFuncao5,
                                                    nomSetor5,
                                                    vlrOperacao5,
                                                    vlrOperacaoSemGift5,
                                                    nroAtend5,
                                                    qtdItem5,
                                                    qtdVendas5,
                                                    qtdMediaItem5,
                                                    vlrMedioItem5,
                                                    vlrComissao5,
                                                    vlrVendaBru5,
                                                    vlrVendaLiq5,
                                                    vlrMedVenda5,
                                                    funcaoLoja5);
            arrMapGerente[contador5] = listFuncGerente;
            contador5++;
        }

        var datOperacao = new Date(this.results.relSemSet.totGerente.datOperacao);
        var matrFuncSetor = this.results.relSemSet.totGerente.matrFuncSetor;
        var nomFunc = this.results.relSemSet.totGerente.nomFunc;
        var codFuncao = this.results.relSemSet.totGerente.codFuncao;
        var nomSetor = this.results.relSemSet.totGerente.nomSetor;
        var vlrOperacao = this.results.relSemSet.totGerente.vlrOperacao;
        var vlrOperacaoSemGift = this.results.relSemSet.totGerente.vlrOperacaoSemGift;
        var nroAtend = this.results.relSemSet.totGerente.nroAtend;
        var qtdItem = this.results.relSemSet.totGerente.qtdItem;
        var qtdVendas = this.results.relSemSet.totGerente.qtdVendas;
        var qtdMediaItem = this.results.relSemSet.totGerente.qtdMediaItem;
        var vlrMedioItem = this.results.relSemSet.totGerente.vlrMedioItem;
        var vlrComissao = this.results.relSemSet.totGerente.vlrComissao;
        var vlrVendaBru = this.results.relSemSet.totGerente.vlrVendaBru;
        var vlrVendaLiq = this.results.relSemSet.totGerente.vlrVendaLiq;
        var vlrMedVenda = this.results.relSemSet.totGerente.vlrMedVenda;
        var funcaoLoja:FuncaoLoja = null;
        var listFuncTotGerente:ListFunc = new ListFunc(datOperacao,
                                                matrFuncSetor,
                                                nomFunc,
                                                codFuncao,
                                                nomSetor,
                                                vlrOperacao,
                                                vlrOperacaoSemGift,
                                                nroAtend,
                                                qtdItem,
                                                qtdVendas,
                                                qtdMediaItem,
                                                vlrMedioItem,
                                                vlrComissao,
                                                vlrVendaBru,
                                                vlrVendaLiq,
                                                vlrMedVenda,
                                                funcaoLoja);
        this.totGerente = listFuncTotGerente;

        this.mapGerente = arrMapGerente;
    }

    preparaDadosRelSemSet() {
        this.relDiarioSemSetor = false;
        
        this.preparaDadosRelSemSetTotGeral()

        this.preparaDadosRelSemSetVendedores()
        
        this.preparaDadosRelSemSetGerentes()

        if(this.results.relSemSet.mapDiario) {
            var contador1 = 0;
            var arrDiario:DiarioSemSetor[] = [];
            for (var key in this.results.relSemSet.mapDiario) {
                this.relDiarioSemSetor = true;
                var contador2 = 0;
                var arrListVendedor:ListFunc[] = [];
                var datMapeada = new Date(key);
                for(var key2 in this.results.relSemSet.mapDiario[key].listVendedor) {
                    var datOperacao = new Date(this.results.relSemSet.mapDiario[key].listVendedor[key2].datOperacao);
                    var matrFuncSetor = this.results.relSemSet.mapDiario[key].listVendedor[key2].matrFuncSetor;
                    var nomFunc = this.results.relSemSet.mapDiario[key].listVendedor[key2].nomFunc;
                    var codFuncao = this.results.relSemSet.mapDiario[key].listVendedor[key2].codFuncao;
                    var nomSetor = this.results.relSemSet.mapDiario[key].listVendedor[key2].nomSetor;
                    var vlrOperacao = this.results.relSemSet.mapDiario[key].listVendedor[key2].vlrOperacao;
                    var vlrOperacaoSemGift = this.results.relSemSet.mapDiario[key].listVendedor[key2].vlrOperacaoSemGift;
                    var nroAtend = this.results.relSemSet.mapDiario[key].listVendedor[key2].nroAtend;
                    var qtdItem = this.results.relSemSet.mapDiario[key].listVendedor[key2].qtdItem;
                    var qtdVendas = this.results.relSemSet.mapDiario[key].listVendedor[key2].qtdVendas;
                    var qtdMediaItem = this.results.relSemSet.mapDiario[key].listVendedor[key2].qtdMediaItem;
                    var vlrMedioItem = this.results.relSemSet.mapDiario[key].listVendedor[key2].vlrMedioItem;
                    var vlrComissao = this.results.relSemSet.mapDiario[key].listVendedor[key2].vlrComissao;
                    var vlrVendaBru = this.results.relSemSet.mapDiario[key].listVendedor[key2].vlrVendaBru;
                    var vlrVendaLiq = this.results.relSemSet.mapDiario[key].listVendedor[key2].vlrVendaLiq;
                    var vlrMedVenda = this.results.relSemSet.mapDiario[key].listVendedor[key2].vlrMedVenda;
                    var fCodFuncao = this.results.relSemSet.mapDiario[key].listVendedor[key2].funcaoLoja.codFuncao;
                    var idtTipoFuncao = this.results.relSemSet.mapDiario[key].listVendedor[key2].funcaoLoja.idtTipoFuncao;
                    var desFuncao = this.results.relSemSet.mapDiario[key].listVendedor[key2].funcaoLoja.desFuncao;
                    var idtAutonomiaRg = this.results.relSemSet.mapDiario[key].listVendedor[key2].funcaoLoja.idtAutonomiaRg;
                    var codCargo = this.results.relSemSet.mapDiario[key].listVendedor[key2].funcaoLoja.codCargo;
                    var gerente = this.results.relSemSet.mapDiario[key].listVendedor[key2].funcaoLoja.gerente;
                    var funcaoLoja:FuncaoLoja = new FuncaoLoja(fCodFuncao,
                        idtTipoFuncao,
                        desFuncao,
                        idtAutonomiaRg,
                        codCargo,
                        gerente)

                    var listFunc:ListFunc = new ListFunc(datOperacao,
                                                        matrFuncSetor,
                                                        nomFunc,
                                                        codFuncao,
                                                        nomSetor,
                                                        vlrOperacao,
                                                        vlrOperacaoSemGift,
                                                        nroAtend,
                                                        qtdItem,
                                                        qtdVendas,
                                                        qtdMediaItem,
                                                        vlrMedioItem,
                                                        vlrComissao,
                                                        vlrVendaBru,
                                                        vlrVendaLiq,
                                                        vlrMedVenda,
                                                        funcaoLoja)
                    arrListVendedor[contador2] = listFunc;
                    contador2++;
                }

                var datOperacao2 = new Date(this.results.relSemSet.mapDiario[key].totVendedor.datOperacao);
                var matrFuncSetor2 = this.results.relSemSet.mapDiario[key].totVendedor.matrFuncSetor;
                var nomFunc2 = this.results.relSemSet.mapDiario[key].totVendedor.nomFunc;
                var codFuncao2 = this.results.relSemSet.mapDiario[key].totVendedor.codFuncao;
                var nomSetor2 = this.results.relSemSet.mapDiario[key].totVendedor.nomSetor;
                var vlrOperacao2 = this.results.relSemSet.mapDiario[key].totVendedor.vlrOperacao;
                var vlrOperacaoSemGift2 = this.results.relSemSet.mapDiario[key].totVendedor.vlrOperacaoSemGift;
                var nroAtend2 = this.results.relSemSet.mapDiario[key].totVendedor.nroAtend;
                var qtdItem2 = this.results.relSemSet.mapDiario[key].totVendedor.qtdItem;
                var qtdVendas2 = this.results.relSemSet.mapDiario[key].totVendedor.qtdVendas;
                var qtdMediaItem2 = this.results.relSemSet.mapDiario[key].totVendedor.qtdMediaItem;
                var vlrMedioItem2 = this.results.relSemSet.mapDiario[key].totVendedor.vlrMedioItem;
                var vlrComissao2 = this.results.relSemSet.mapDiario[key].totVendedor.vlrComissao;
                var vlrVendaBru2 = this.results.relSemSet.mapDiario[key].totVendedor.vlrVendaBru;
                var vlrVendaLiq2 = this.results.relSemSet.mapDiario[key].totVendedor.vlrVendaLiq;
                var vlrMedVenda2 = this.results.relSemSet.mapDiario[key].totVendedor.vlrMedVenda;
                var funcaoLoja2:FuncaoLoja = null;
                var totVendedor:ListFunc = new ListFunc(datOperacao2,
                        matrFuncSetor2,
                        nomFunc2,
                        codFuncao2,
                        nomSetor2,
                        vlrOperacao2,
                        vlrOperacaoSemGift2,
                        nroAtend2,
                        qtdItem2,
                        qtdVendas2,
                        qtdMediaItem2,
                        vlrMedioItem2,
                        vlrComissao2,
                        vlrVendaBru2,
                        vlrVendaLiq2,
                        vlrMedVenda2,
                        funcaoLoja2);
                
                var contador2 = 0;
                var arrListGerente:ListFunc[] = [];

                for(var key2 in this.results.relSemSet.mapDiario[key].listGerente) {
                    var datOperacao = new Date(this.results.relSemSet.mapDiario[key].listGerente[key2].datOperacao);
                    var matrFuncSetor = this.results.relSemSet.mapDiario[key].listGerente[key2].matrFuncSetor;
                    var nomFunc = this.results.relSemSet.mapDiario[key].listGerente[key2].nomFunc;
                    var codFuncao = this.results.relSemSet.mapDiario[key].listGerente[key2].codFuncao;
                    var nomSetor = this.results.relSemSet.mapDiario[key].listGerente[key2].nomSetor;
                    var vlrOperacao = this.results.relSemSet.mapDiario[key].listGerente[key2].vlrOperacao;
                    var vlrOperacaoSemGift = this.results.relSemSet.mapDiario[key].listGerente[key2].vlrOperacaoSemGift;
                    var nroAtend = this.results.relSemSet.mapDiario[key].listGerente[key2].nroAtend;
                    var qtdItem = this.results.relSemSet.mapDiario[key].listGerente[key2].qtdItem;
                    var qtdVendas = this.results.relSemSet.mapDiario[key].listGerente[key2].qtdVendas;
                    var qtdMediaItem = this.results.relSemSet.mapDiario[key].listGerente[key2].qtdMediaItem;
                    var vlrMedioItem = this.results.relSemSet.mapDiario[key].listGerente[key2].vlrMedioItem;
                    var vlrComissao = this.results.relSemSet.mapDiario[key].listGerente[key2].vlrComissao;
                    var vlrVendaBru = this.results.relSemSet.mapDiario[key].listGerente[key2].vlrVendaBru;
                    var vlrVendaLiq = this.results.relSemSet.mapDiario[key].listGerente[key2].vlrVendaLiq;
                    var vlrMedVenda = this.results.relSemSet.mapDiario[key].listGerente[key2].vlrMedVenda;
                    var fCodFuncao = this.results.relSemSet.mapDiario[key].listGerente[key2].funcaoLoja.codFuncao;
                    var idtTipoFuncao = this.results.relSemSet.mapDiario[key].listGerente[key2].funcaoLoja.idtTipoFuncao;
                    var desFuncao = this.results.relSemSet.mapDiario[key].listGerente[key2].funcaoLoja.desFuncao;
                    var idtAutonomiaRg = this.results.relSemSet.mapDiario[key].listGerente[key2].funcaoLoja.idtAutonomiaRg;
                    var codCargo = this.results.relSemSet.mapDiario[key].listGerente[key2].funcaoLoja.codCargo;
                    var gerente = this.results.relSemSet.mapDiario[key].listGerente[key2].funcaoLoja.gerente;
                    var funcaoLoja:FuncaoLoja = new FuncaoLoja(fCodFuncao,
                        idtTipoFuncao,
                        desFuncao,
                        idtAutonomiaRg,
                        codCargo,
                        gerente)

                    var listFunc:ListFunc = new ListFunc(datOperacao,
                                                        matrFuncSetor,
                                                        nomFunc,
                                                        codFuncao,
                                                        nomSetor,
                                                        vlrOperacao,
                                                        vlrOperacaoSemGift,
                                                        nroAtend,
                                                        qtdItem,
                                                        qtdVendas,
                                                        qtdMediaItem,
                                                        vlrMedioItem,
                                                        vlrComissao,
                                                        vlrVendaBru,
                                                        vlrVendaLiq,
                                                        vlrMedVenda,
                                                        funcaoLoja)
                    arrListGerente[contador2] = listFunc;
                    contador2++;
                }

                var datOperacao3 = new Date(this.results.relSemSet.mapDiario[key].totGerente.datOperacao);
                var matrFuncSetor3 = this.results.relSemSet.mapDiario[key].totGerente.matrFuncSetor;
                var nomFunc3 = this.results.relSemSet.mapDiario[key].totGerente.nomFunc;
                var codFuncao3 = this.results.relSemSet.mapDiario[key].totGerente.codFuncao;
                var nomSetor3 = this.results.relSemSet.mapDiario[key].totGerente.nomSetor;
                var vlrOperacao3 = this.results.relSemSet.mapDiario[key].totGerente.vlrOperacao;
                var vlrOperacaoSemGift3 = this.results.relSemSet.mapDiario[key].totGerente.vlrOperacaoSemGift;
                var nroAtend3 = this.results.relSemSet.mapDiario[key].totGerente.nroAtend;
                var qtdItem3 = this.results.relSemSet.mapDiario[key].totGerente.qtdItem;
                var qtdVendas3 = this.results.relSemSet.mapDiario[key].totGerente.qtdVendas;
                var qtdMediaItem3 = this.results.relSemSet.mapDiario[key].totGerente.qtdMediaItem;
                var vlrMedioItem3 = this.results.relSemSet.mapDiario[key].totGerente.vlrMedioItem;
                var vlrComissao3 = this.results.relSemSet.mapDiario[key].totGerente.vlrComissao;
                var vlrVendaBru3 = this.results.relSemSet.mapDiario[key].totGerente.vlrVendaBru;
                var vlrVendaLiq3 = this.results.relSemSet.mapDiario[key].totGerente.vlrVendaLiq;
                var vlrMedVenda3 = this.results.relSemSet.mapDiario[key].totGerente.vlrMedVenda;
                var funcaoLoja3:FuncaoLoja = null;
                var totGerente:ListFunc = new ListFunc(datOperacao3,
                        matrFuncSetor3,
                        nomFunc3,
                        codFuncao3,
                        nomSetor3,
                        vlrOperacao3,
                        vlrOperacaoSemGift3,
                        nroAtend3,
                        qtdItem3,
                        qtdVendas3,
                        qtdMediaItem3,
                        vlrMedioItem3,
                        vlrComissao3,
                        vlrVendaBru3,
                        vlrVendaLiq3,
                        vlrMedVenda3,
                        funcaoLoja3);
                
                var datOperacao4 = new Date(this.results.relSemSet.mapDiario[key].totGeral.datOperacao);
                var matrFuncSetor4 = this.results.relSemSet.mapDiario[key].totGeral.matrFuncSetor;
                var nomFunc4 = this.results.relSemSet.mapDiario[key].totGeral.nomFunc;
                var codFuncao4 = this.results.relSemSet.mapDiario[key].totGeral.codFuncao;
                var nomSetor4 = this.results.relSemSet.mapDiario[key].totGeral.nomSetor;
                var vlrOperacao4 = this.results.relSemSet.mapDiario[key].totGeral.vlrOperacao;
                var vlrOperacaoSemGift4 = this.results.relSemSet.mapDiario[key].totGeral.vlrOperacaoSemGift;
                var nroAtend4 = this.results.relSemSet.mapDiario[key].totGeral.nroAtend;
                var qtdItem4 = this.results.relSemSet.mapDiario[key].totGeral.qtdItem;
                var qtdVendas4 = this.results.relSemSet.mapDiario[key].totGeral.qtdVendas;
                var qtdMediaItem4 = this.results.relSemSet.mapDiario[key].totGeral.qtdMediaItem;
                var vlrMedioItem4 = this.results.relSemSet.mapDiario[key].totGeral.vlrMedioItem;
                var vlrComissao4 = this.results.relSemSet.mapDiario[key].totGeral.vlrComissao;
                var vlrVendaBru4 = this.results.relSemSet.mapDiario[key].totGeral.vlrVendaBru;
                var vlrVendaLiq4 = this.results.relSemSet.mapDiario[key].totGeral.vlrVendaLiq;
                var vlrMedVenda4 = this.results.relSemSet.mapDiario[key].totGeral.vlrMedVenda;
                var funcaoLoja4:FuncaoLoja = null;
                var totDia:ListFunc = new ListFunc(datOperacao4,
                        matrFuncSetor4,
                        nomFunc4,
                        codFuncao4,
                        nomSetor4,
                        vlrOperacao4,
                        vlrOperacaoSemGift4,
                        nroAtend4,
                        qtdItem4,
                        qtdVendas4,
                        qtdMediaItem4,
                        vlrMedioItem4,
                        vlrComissao4,
                        vlrVendaBru4,
                        vlrVendaLiq4,
                        vlrMedVenda4,
                        funcaoLoja4);
                var diarioSemSetor:DiarioSemSetor = new DiarioSemSetor(datMapeada,
                                                                    arrListVendedor,
                                                                    totVendedor,
                                                                    arrListGerente,
                                                                    totGerente,
                                                                    totDia);
                arrDiario[contador1] = diarioSemSetor;
                contador1++;
            }

            
            this.mapDiarioSemSetor = new MapDiarioSemSetor(arrDiario);
            console.log(this.mapDiarioSemSetor);
        }
    }

    preparaDadosRelComSetMapSetor(){
        var contador5 = 0;
        var arrMapSetor:ListFunc[] = [];

        for(var key5 in this.results.relComSet.mapSetor) {
            var datOperacao5 = new Date(this.results.relComSet.mapSetor[key5].datOperacao);
            var matrFuncSetor5 = this.results.relComSet.mapSetor[key5].matrFuncSetor;
            var nomFunc5 = this.results.relComSet.mapSetor[key5].nomFunc;
            var codFuncao5 = this.results.relComSet.mapSetor[key5].codFuncao;
            var nomSetor5 = this.results.relComSet.mapSetor[key5].nomSetor;
            var vlrOperacao5 = this.results.relComSet.mapSetor[key5].vlrOperacao;
            var vlrOperacaoSemGift5 = this.results.relComSet.mapSetor[key5].vlrOperacaoSemGift;
            var nroAtend5 = this.results.relComSet.mapSetor[key5].nroAtend;
            var qtdItem5 = this.results.relComSet.mapSetor[key5].qtdItem;
            var qtdVendas5 = this.results.relComSet.mapSetor[key5].qtdVendas;
            var qtdMediaItem5 = this.results.relComSet.mapSetor[key5].qtdMediaItem;
            var vlrMedioItem5 = this.results.relComSet.mapSetor[key5].vlrMedioItem;
            var vlrComissao5 = this.results.relComSet.mapSetor[key5].vlrComissao;
            var vlrVendaBru5 = this.results.relComSet.mapSetor[key5].vlrVendaBru;
            var vlrVendaLiq5 = this.results.relComSet.mapSetor[key5].vlrVendaLiq;
            var vlrMedVenda5 = this.results.relComSet.mapSetor[key5].vlrMedVenda;
            var funcaoLoja5:FuncaoLoja = null;
            var listFuncSetor:ListFunc = new ListFunc(datOperacao5,
                                                    matrFuncSetor5,
                                                    nomFunc5,
                                                    codFuncao5,
                                                    nomSetor5,
                                                    vlrOperacao5,
                                                    vlrOperacaoSemGift5,
                                                    nroAtend5,
                                                    qtdItem5,
                                                    qtdVendas5,
                                                    qtdMediaItem5,
                                                    vlrMedioItem5,
                                                    vlrComissao5,
                                                    vlrVendaBru5,
                                                    vlrVendaLiq5,
                                                    vlrMedVenda5,
                                                    funcaoLoja5);
            arrMapSetor[contador5] = listFuncSetor;
            contador5++;
        }

        this.mapSetor = arrMapSetor;
    }

    preparaDadosRelComSetMapFunc() {
        var contador4 = 0;
        var arrMapFunc2:MapFunc[] = [];

        for(var key4 in this.results.relComSet.mapFunc) {
            var arrKey4 = key4.split(";");
            var matrFuncSetor3 = arrKey4[0].substring(arrKey4[0].indexOf(":")+1,arrKey4[0].length);
            var nomFunc3 = arrKey4[1].substring(arrKey4[1].indexOf(":")+1,arrKey4[1].length);
            var codFuncao3 = arrKey4[2].substring(arrKey4[2].indexOf(":")+1,arrKey4[2].length);
            var datOperacao4 = new Date(this.results.relComSet.mapFunc[key4].totFunc.datOperacao);
            var matrFuncSetor4 = this.results.relComSet.mapFunc[key4].totFunc.matrFuncSetor;
            var nomFunc4 = this.results.relComSet.mapFunc[key4].totFunc.nomFunc;
            var codFuncao4 = this.results.relComSet.mapFunc[key4].totFunc.codFuncao;
            var nomSetor4 = this.results.relComSet.mapFunc[key4].totFunc.nomSetor;
            var vlrOperacao4 = this.results.relComSet.mapFunc[key4].totFunc.vlrOperacao;
            var vlrOperacaoSemGift4 = this.results.relComSet.mapFunc[key4].totFunc.vlrOperacaoSemGift;
            var nroAtend4 = this.results.relComSet.mapFunc[key4].totFunc.nroAtend;
            var qtdItem4 = this.results.relComSet.mapFunc[key4].totFunc.qtdItem;
            var qtdVendas4 = this.results.relComSet.mapFunc[key4].totFunc.qtdVendas;
            var qtdMediaItem4 = this.results.relComSet.mapFunc[key4].totFunc.qtdMediaItem;
            var vlrMedioItem4 = this.results.relComSet.mapFunc[key4].totFunc.vlrMedioItem;
            var vlrComissao4 = this.results.relComSet.mapFunc[key4].totFunc.vlrComissao;
            var vlrVendaBru4 = this.results.relComSet.mapFunc[key4].totFunc.vlrVendaBru;
            var vlrVendaLiq4 = this.results.relComSet.mapFunc[key4].totFunc.vlrVendaLiq;
            var vlrMedVenda4 = this.results.relComSet.mapFunc[key4].totFunc.vlrMedVenda;
            var funcaoLoja4:FuncaoLoja = null;
            var totFunc2:ListFunc = new ListFunc(datOperacao4,
                    matrFuncSetor4,
                    nomFunc4,
                    codFuncao4,
                    nomSetor4,
                    vlrOperacao4,
                    vlrOperacaoSemGift4,
                    nroAtend4,
                    qtdItem4,
                    qtdVendas4,
                    qtdMediaItem4,
                    vlrMedioItem4,
                    vlrComissao4,
                    vlrVendaBru4,
                    vlrVendaLiq4,
                    vlrMedVenda4,
                    funcaoLoja4);
            var mapFunc2:MapFunc = new MapFunc(matrFuncSetor3,
                                            nomFunc3,
                                            codFuncao3,
                                            null,
                                            totFunc2)
            arrMapFunc2[contador4] = mapFunc2;
            contador4++;
        }
        //console.log(arrMapFunc2);
        this.mapFunc = arrMapFunc2;
    }

    preparaDadosRelComSetTotGeral() {
        var datOperacao = new Date(this.results.relComSet.totGeral.datOperacao);
        var matrFuncSetor = this.results.relComSet.totGeral.matrFuncSetor;
        var nomFunc = this.results.relComSet.totGeral.nomFunc;
        var codFuncao = this.results.relComSet.totGeral.codFuncao;
        var nomSetor = this.results.relComSet.totGeral.nomSetor;
        var vlrOperacao = this.results.relComSet.totGeral.vlrOperacao;
        var vlrOperacaoSemGift = this.results.relComSet.totGeral.vlrOperacaoSemGift;
        var nroAtend = this.results.relComSet.totGeral.nroAtend;
        var qtdItem = this.results.relComSet.totGeral.qtdItem;
        var qtdVendas = this.results.relComSet.totGeral.qtdVendas;
        var qtdMediaItem = this.results.relComSet.totGeral.qtdMediaItem;
        var vlrMedioItem = this.results.relComSet.totGeral.vlrMedioItem;
        var vlrComissao = this.results.relComSet.totGeral.vlrComissao;
        var vlrVendaBru = this.results.relComSet.totGeral.vlrVendaBru;
        var vlrVendaLiq = this.results.relComSet.totGeral.vlrVendaLiq;
        var vlrMedVenda = this.results.relComSet.totGeral.vlrMedVenda;
        var funcaoLoja:FuncaoLoja = null;
        var totGeral:ListFunc = new ListFunc(datOperacao,
                                            matrFuncSetor,
                                            nomFunc,
                                            codFuncao,
                                            nomSetor,
                                            vlrOperacao,
                                            vlrOperacaoSemGift,
                                            nroAtend,
                                            qtdItem,
                                            qtdVendas,
                                            qtdMediaItem,
                                            vlrMedioItem,
                                            vlrComissao,
                                            vlrVendaBru,
                                            vlrVendaLiq,
                                            vlrMedVenda,
                                            funcaoLoja);
        this.totGeral = totGeral;
    }

    preparaDadosRelComSet() {
        this.relDiario = false;
        
        this.preparaDadosRelComSetTotGeral()

        this.preparaDadosRelComSetMapSetor()
        
        this.preparaDadosRelComSetMapFunc()

        if(this.results.relComSet.mapDiario) {
            var contador1 = 0;
            var arrDiario:Diario[] = [];
            for (var key in this.results.relComSet.mapDiario) {
                this.relDiario = true;
                var contador2 = 0;
                var arrMapFunc:MapFunc[] = [];
                var datMapeada = new Date(key);
                for(var key2 in this.results.relComSet.mapDiario[key].mapFunc) {
                    var contador3 = 0;
                    var arrListFunc:ListFunc[] = [];
                    var arrKey2 = key2.split(";");
                    var matrFuncSetor1 = arrKey2[0].substring(arrKey2[0].indexOf(":")+1,arrKey2[0].length);
                    var nomFunc1 = arrKey2[1].substring(arrKey2[1].indexOf(":")+1,arrKey2[1].length);
                    var codFuncao1 = arrKey2[2].substring(arrKey2[2].indexOf(":")+1,arrKey2[2].length);
                    for(var key3 in this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc) {
                        var datOperacao = new Date(this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].datOperacao);
                        var matrFuncSetor = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].matrFuncSetor;
                        var nomFunc = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].nomFunc;
                        var codFuncao = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].codFuncao;
                        var nomSetor = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].nomSetor;
                        var vlrOperacao = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].vlrOperacao;
                        var vlrOperacaoSemGift = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].vlrOperacaoSemGift;
                        var nroAtend = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].nroAtend;
                        var qtdItem = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].qtdItem;
                        var qtdVendas = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].qtdVendas;
                        var qtdMediaItem = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].qtdMediaItem;
                        var vlrMedioItem = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].vlrMedioItem;
                        var vlrComissao = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].vlrComissao;
                        var vlrVendaBru = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].vlrVendaBru;
                        var vlrVendaLiq = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].vlrVendaLiq;
                        var vlrMedVenda = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].vlrMedVenda;
                        var fCodFuncao = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].funcaoLoja.codFuncao;
                        var idtTipoFuncao = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].funcaoLoja.idtTipoFuncao;
                        var desFuncao = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].funcaoLoja.desFuncao;
                        var idtAutonomiaRg = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].funcaoLoja.idtAutonomiaRg;
                        var codCargo = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].funcaoLoja.codCargo;
                        var gerente = this.results.relComSet.mapDiario[key].mapFunc[key2].listFunc[key3].funcaoLoja.gerente;
                        var funcaoLoja:FuncaoLoja = new FuncaoLoja(fCodFuncao,
                            idtTipoFuncao,
                            desFuncao,
                            idtAutonomiaRg,
                            codCargo,
                            gerente)

                        var listFunc:ListFunc = new ListFunc(datOperacao,
                                                            matrFuncSetor,
                                                            nomFunc,
                                                            codFuncao,
                                                            nomSetor,
                                                            vlrOperacao,
                                                            vlrOperacaoSemGift,
                                                            nroAtend,
                                                            qtdItem,
                                                            qtdVendas,
                                                            qtdMediaItem,
                                                            vlrMedioItem,
                                                            vlrComissao,
                                                            vlrVendaBru,
                                                            vlrVendaLiq,
                                                            vlrMedVenda,
                                                            funcaoLoja)
                        arrListFunc[contador3] = listFunc;
                        contador3++;
                    }

                    var datOperacao2 = new Date(this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.datOperacao);
                    var matrFuncSetor2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.matrFuncSetor;
                    var nomFunc2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.nomFunc;
                    var codFuncao2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.codFuncao;
                    var nomSetor2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.nomSetor;
                    var vlrOperacao2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.vlrOperacao;
                    var vlrOperacaoSemGift2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.vlrOperacaoSemGift;
                    var nroAtend2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.nroAtend;
                    var qtdItem2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.qtdItem;
                    var qtdVendas2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.qtdVendas;
                    var qtdMediaItem2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.qtdMediaItem;
                    var vlrMedioItem2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.vlrMedioItem;
                    var vlrComissao2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.vlrComissao;
                    var vlrVendaBru2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.vlrVendaBru;
                    var vlrVendaLiq2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.vlrVendaLiq;
                    var vlrMedVenda2 = this.results.relComSet.mapDiario[key].mapFunc[key2].totFunc.vlrMedVenda;
                    var funcaoLoja2:FuncaoLoja = null;
                    var totFunc:ListFunc = new ListFunc(datOperacao2,
                            matrFuncSetor2,
                            nomFunc2,
                            codFuncao2,
                            nomSetor2,
                            vlrOperacao2,
                            vlrOperacaoSemGift2,
                            nroAtend2,
                            qtdItem2,
                            qtdVendas2,
                            qtdMediaItem2,
                            vlrMedioItem2,
                            vlrComissao2,
                            vlrVendaBru2,
                            vlrVendaLiq2,
                            vlrMedVenda2,
                            funcaoLoja2);

                    var mapFunc:MapFunc = new MapFunc(matrFuncSetor1,
                                                    nomFunc1,
                                                    codFuncao1,
                                                    arrListFunc,
                                                    totFunc);
                    arrMapFunc[contador2] = mapFunc;
                    contador2++;
                }

                var datOperacao6 = new Date(this.results.relComSet.mapDiario[key].totGeral.datOperacao);
                var matrFuncSetor6 = this.results.relComSet.mapDiario[key].totGeral.matrFuncSetor;
                var nomFunc6 = this.results.relComSet.mapDiario[key].totGeral.nomFunc;
                var codFuncao6 = this.results.relComSet.mapDiario[key].totGeral.codFuncao;
                var nomSetor6 = this.results.relComSet.mapDiario[key].totGeral.nomSetor;
                var vlrOperacao6 = this.results.relComSet.mapDiario[key].totGeral.vlrOperacao;
                var vlrOperacaoSemGift6 = this.results.relComSet.mapDiario[key].totGeral.vlrOperacaoSemGift;
                var nroAtend6 = this.results.relComSet.mapDiario[key].totGeral.nroAtend;
                var qtdItem6 = this.results.relComSet.mapDiario[key].totGeral.qtdItem;
                var qtdVendas6 = this.results.relComSet.mapDiario[key].totGeral.qtdVendas;
                var qtdMediaItem6 = this.results.relComSet.mapDiario[key].totGeral.qtdMediaItem;
                var vlrMedioItem6 = this.results.relComSet.mapDiario[key].totGeral.vlrMedioItem;
                var vlrComissao6 = this.results.relComSet.mapDiario[key].totGeral.vlrComissao;
                var vlrVendaBru6 = this.results.relComSet.mapDiario[key].totGeral.vlrVendaBru;
                var vlrVendaLiq6 = this.results.relComSet.mapDiario[key].totGeral.vlrVendaLiq;
                var vlrMedVenda6 = this.results.relComSet.mapDiario[key].totGeral.vlrMedVenda;
                var funcaoLoja6:FuncaoLoja = null;
                var totDia:ListFunc = new ListFunc(datOperacao6,
                        matrFuncSetor6,
                        nomFunc6,
                        codFuncao6,
                        nomSetor6,
                        vlrOperacao6,
                        vlrOperacaoSemGift6,
                        nroAtend6,
                        qtdItem6,
                        qtdVendas6,
                        qtdMediaItem6,
                        vlrMedioItem6,
                        vlrComissao6,
                        vlrVendaBru6,
                        vlrVendaLiq6,
                        vlrMedVenda6,
                        funcaoLoja6);

                var diario:Diario = new Diario(datMapeada,
                                            arrMapFunc,
                                            totDia);
                arrDiario[contador1] = diario;
                contador1++;
                
            }
            this.mapDiario = new MapDiario(arrDiario);
            console.log(this.mapDiario);
        }
    }
    /*mostra(result:DadosResultadoCupons) {
        const id=result.codEstab+"_"+result.nroSeqVenda;
        const elemento = document.getElementById(id);
        console.log(elemento);
        this.results.forEach((element, index, array) => {
            if(element.codEstab == result.codEstab && element.nroSeqVenda== result.nroSeqVenda) {
                if(element.listItensVenda == null) {
                    this.consCupTroService
                    .searchDetalhe(result.codEstab, result.nroSeqVenda)
                    .subscribe((res:any) => {
                            if(res != null){
                                console.log(res);
                                element.listItensVenda = res.listItensVenda;
                                element.listVendaTef = res.listVendaTef;
                                element.listReceb = res.listReceb;
                            }
                            console.log(this.results);
                        },err => {
                            console.log(err);
                        }
                    );
                    //const itemVenda = new ItensVenda("N","Teste 123","Descrição teste","Azul","40",199.99,1);

                    //const itemVenda2 = new ItensVenda("N","Teste 456","Descrição teste","Azul","40",199.99,1);
                    //element.listItensVenda = [];
                    //element.listItensVenda[0]=itemVenda;
                    //element.listItensVenda[1]=itemVenda2;
                }
                
            }
        })
        
        elemento.style.display == "none" 
         ?
         elemento.style.display = "block"
         :
         elemento.style.display = "none"
    }*/
}
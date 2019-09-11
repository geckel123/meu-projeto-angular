import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { dateRangeValidatorFactory } from 'src/app/shared/validators/date-range.validator';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AutoCompleteLojaService } from 'src/app/shared/components/autocomplete/loja/auto-complete-loja.service';
import { IConsultaCuponsTroca, DadosResultadoCupons, ItensVenda, IConsultaDetalhesCuponsTroca } from './consulta-cupons-troca';
import { ConsultaCuponsTrocaService } from './consulta-cupons-troca.service';
import { IProdutoResponse } from 'src/app/shared/components/autocomplete/produto/auto-complete-produto';
import { AutoCompleteProdutoService } from 'src/app/shared/components/autocomplete/produto/auto-complete-produto.service';
import { ProdutoCpfValidator } from './produto-cpf.validator';
import { ResponseData } from 'src/app/shared/interfaces/response-data';
import { ListData } from 'src/app/shared/interfaces/list-data';
import { Estabelecimento } from 'src/app/cadastros/cadastro-estabelecimentos/cadastro-estabelecimentos';

@Component({
    templateUrl: "./consulta-cupons-troca.component.html",
    styleUrls: ['./consulta-cupons-troca.component.css']
})
export class ConsultaCuponsTrocaComponent implements OnInit{

    defaultForm: FormGroup;
    results: any;
    noresult: boolean = false;
    maximoDiasPeriodo: number = 90;
    filteredLojas: Observable<ResponseData<ListData<Estabelecimento>>>;
    filteredProdutos: Observable<IProdutoResponse>;
    
    constructor(private fb: FormBuilder, 
                private consCupTroService: ConsultaCuponsTrocaService,
                private autoCompleteLojaService: AutoCompleteLojaService,
                private autoCompleteProdutoService: AutoCompleteProdutoService) {}

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
            produtoInput: [''],
            cpfCnpjClienteInput: [''],
            lojaInput: ['']
        },{
            validator: [
                dateRangeValidatorFactory(this.maximoDiasPeriodo),
                ProdutoCpfValidator
            ]
        });

        this.filteredLojas = this.defaultForm.get('lojaInput').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.autoCompleteLojaService.search(this.defaultForm.get('lojaInput').value))
      );

      this.filteredProdutos = this.defaultForm.get('produtoInput').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.autoCompleteProdutoService.search(this.defaultForm.get('produtoInput').value))
      );
    }

    displayFn(loja: string) {
        if (loja) { return loja }
      }

    search() {
        if(this.defaultForm.valid && !this.defaultForm.pending) {
            const dataIni = this.defaultForm.get('dataIniInput').value;
            const dataFim = this.defaultForm.get('dataFimInput').value;
            const produto = this.defaultForm.get('produtoInput').value;
            const loja = this.defaultForm.get('lojaInput').value;
            const cpfCnpjCliente = this.defaultForm.get('cpfCnpjClienteInput').value;

            this.noresult = false;
            this.results = null;
            this.consCupTroService
            .search(dataIni, dataFim, loja, produto, cpfCnpjCliente)
            .subscribe((res:IConsultaCuponsTroca) => {
                    if(res == null){
                        this.noresult = true;
                    } else {
                        this.results = res;
                    }
                    console.log(this.results);
                },err => {
                    console.log(err);
                }
            );
        }

    }

    mostra(result:DadosResultadoCupons) {
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
    }
}
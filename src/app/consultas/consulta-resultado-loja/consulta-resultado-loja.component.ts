import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ConsultaResultadoLojaService } from './consulta-resultado-loja.service';
import { IConsultaResultadoLoja } from './consulta-resultado-loja';
import { dateRangeValidatorFactory } from 'src/app/shared/validators/date-range.validator';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AutoCompleteLojaService } from 'src/app/shared/components/autocomplete/loja/auto-complete-loja.service';
import { Estabelecimento } from 'src/app/cadastros/cadastro-estabelecimentos/cadastro-estabelecimentos';
import { ListData } from 'src/app/shared/interfaces/list-data';
import { ResponseData } from 'src/app/shared/interfaces/response-data';

@Component({
    templateUrl: "./consulta-resultado-loja.component.html"
})
export class ConsultaResultadoLojaComponent implements OnInit{

    defaultForm: FormGroup;
    results: IConsultaResultadoLoja;
    noresult: boolean = false;
    maximoDiasPeriodo: number = 31;
    filteredLojas: Observable<ResponseData<ListData<Estabelecimento>>>;
    
    constructor(private fb: FormBuilder, 
                private consResLojaService: ConsultaResultadoLojaService,
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
            lojaInput: ['', 
                [
                Validators.required
                ]
            ]
        },{
            validator: dateRangeValidatorFactory(this.maximoDiasPeriodo)
        });

        this.filteredLojas = this.defaultForm.get('lojaInput').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.autoCompleteLojaService.search(this.defaultForm.get('lojaInput').value))
      );
    }

    displayFn(loja: string) {
        if (loja) { return loja }
      }

    search() {
        if(this.defaultForm.valid && !this.defaultForm.pending) {
            const dataIni = this.defaultForm.get('dataIniInput').value;
            const dataFim = this.defaultForm.get('dataFimInput').value;
            const loja = this.defaultForm.get('lojaInput').value;

            this.noresult = false;
            this.results = null;
            this.consResLojaService
            .search(dataIni, dataFim, loja)
            .subscribe((res:IConsultaResultadoLoja) => {
                    if(res == null){
                        this.noresult = true;
                    } else {
                        this.results = res;
                    }
                },err => {
                    console.log(err);
                }
            );
        }

    }
}
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

import { debounceTime, tap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { PdvsNfceDataSource } from './pdvs-nfce-datasource';
import { CadastroPdvsNfceService } from './cadastro-pdvs-nfce.service';
import { UserService } from 'src/app/core/user/user.service';
import { ResponseData } from 'src/app/shared/interfaces/response-data';
import { ListData } from 'src/app/shared/interfaces/list-data';
import { Estabelecimento } from '../cadastro-estabelecimentos/cadastro-estabelecimentos';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AutoCompleteLojaService } from 'src/app/shared/components/autocomplete/loja/auto-complete-loja.service';

@Component({
    templateUrl: "./cadastro-pdvs-nfce.component.html"
})
export class CadastroPdvsNfceComponent implements OnInit{

    displayedColumns: string[] = ['estab', 'PDV', 'serie_nfce', 'serie_sat', 'equip_sat','action'];
    dataSource: PdvsNfceDataSource;

    estabelecimentoForm: FormGroup;
    filteredEstabelecimentos: Observable<ResponseData<ListData<Estabelecimento>>>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('input', { static: true }) input: ElementRef;

    constructor(private fb: FormBuilder,
                private cadPdvNfceService: CadastroPdvsNfceService,
                private autoCompleteEstabService: AutoCompleteLojaService) {}

    ngOnInit(): void {
      this.dataSource = new PdvsNfceDataSource(this.cadPdvNfceService);
      this.dataSource.loadPdvsNfce('', '', 0, 5);
      this.estabelecimentoForm = this.fb.group({
          COD_ESTAB: ''
        });
      this.filteredEstabelecimentos = this.estabelecimentoForm.get('COD_ESTAB').valueChanges
                .pipe(
                  debounceTime(300),
                  switchMap(value => this.autoCompleteEstabService.search(this.estabelecimentoForm.get('COD_ESTAB').value)),
                  tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadPdvsNfcePage();
                  })
                );

    }

    ngAfterViewInit() {

        // server-side search
        fromEvent(this.input.nativeElement,'keyup')
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadPdvsNfcePage();
                })
            )
            .subscribe();

        this.paginator.page
            .pipe(
                tap(() => this.loadPdvsNfcePage())
            )
            .subscribe();
    }

    loadPdvsNfcePage() {

        this.dataSource.loadPdvsNfce(
            this.estabelecimentoForm.get('COD_ESTAB').value,
            this.input.nativeElement.value,
            this.paginator.pageIndex,
            this.paginator.pageSize);
    }
}
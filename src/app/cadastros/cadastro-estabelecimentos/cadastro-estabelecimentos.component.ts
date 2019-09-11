import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';

import { debounceTime, tap, distinctUntilChanged } from 'rxjs/operators';
import { CadastroEstabelecimentosService } from './cadastro-estabelecimentos.service';
import { EstabelecimentosDataSource } from './estabelecimentos-datasource';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    templateUrl: "./cadastro-estabelecimentos.component.html"
})
export class CadastroEstabelecimentosComponent implements OnInit{

    displayedColumns: string[] = ['nro', 'nome', 'cnpj','action'];
    dataSource: EstabelecimentosDataSource;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('input', { static: true }) input: ElementRef;

    constructor(private cadEstabService: CadastroEstabelecimentosService) {}

    ngOnInit(): void {
      this.dataSource = new EstabelecimentosDataSource(this.cadEstabService);
      this.dataSource.loadEstabelecimentos('', 0, 5);
    }

    ngAfterViewInit() {

        // server-side search
        fromEvent(this.input.nativeElement,'keyup')
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadEstabelecimentosPage();
                })
            )
            .subscribe();

        this.paginator.page
            .pipe(
                tap(() => this.loadEstabelecimentosPage())
            )
            .subscribe();
    }

    loadEstabelecimentosPage() {
        this.dataSource.loadEstabelecimentos(
            this.input.nativeElement.value,
            this.paginator.pageIndex,
            this.paginator.pageSize);
    }
}
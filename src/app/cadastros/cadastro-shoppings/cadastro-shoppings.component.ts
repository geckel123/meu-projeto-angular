import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';

import { debounceTime, tap, distinctUntilChanged } from 'rxjs/operators';
import { ShoppingsDataSource } from './shoppings-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { CadastroShoppingsService } from './cadastro-shoppings.service';

@Component({
    templateUrl: "./cadastro-shoppings.component.html"
})
export class CadastroShoppingsComponent implements OnInit{

    displayedColumns: string[] = ['nro', 'nome', 'nome_resumido','action'];
    dataSource: ShoppingsDataSource;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('input', { static: true }) input: ElementRef;

    constructor(private cadShoppingService: CadastroShoppingsService) {}

    ngOnInit(): void {
      this.dataSource = new ShoppingsDataSource(this.cadShoppingService);
      this.dataSource.loadShoppings('', 0, 5);
    }

    ngAfterViewInit() {

        // server-side search
        fromEvent(this.input.nativeElement,'keyup')
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadShoppingsPage();
                })
            )
            .subscribe();

        this.paginator.page
            .pipe(
                tap(() => this.loadShoppingsPage())
            )
            .subscribe();
    }

    loadShoppingsPage() {
        this.dataSource.loadShoppings(
            this.input.nativeElement.value,
            this.paginator.pageIndex,
            this.paginator.pageSize);
    }
}
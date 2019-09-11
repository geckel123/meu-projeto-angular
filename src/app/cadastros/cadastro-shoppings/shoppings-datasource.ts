import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Shopping } from "./cadastro-shoppings";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { CadastroShoppingsService } from "./cadastro-shoppings.service";
import { ResponseData } from "src/app/shared/interfaces/response-data";
import { ListData } from "src/app/shared/interfaces/list-data";

export class ShoppingsDataSource implements DataSource<Shopping> {

    private shoppingsSubject = new BehaviorSubject<Shopping[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    private loadedSubject = new BehaviorSubject<boolean>(true);

    public loaded$ = this.loadedSubject.asObservable();

    private totalSubject = new BehaviorSubject<number>(0);

    public total$ = this.totalSubject.asObservable();

    constructor(private shoppingService: CadastroShoppingsService) {}

    connect(collectionViewer: CollectionViewer): Observable<Shopping[]> {
        return this.shoppingsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.shoppingsSubject.complete();
        this.loadingSubject.complete();
        this.loadedSubject.complete();
        this.totalSubject.complete();
    }

    loadShoppings(query = '', page = 0, size = 5) {
        this.loadingSubject.next(true);
        this.loadedSubject.next(false);

        this.shoppingService.list(query, page, size)
            .pipe(
                catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((shoppings: ResponseData<ListData<Shopping>>)=> {
            this.totalSubject.next(shoppings.dados.totalRegistros);
            this.loadedSubject.next(true);
            return this.shoppingsSubject.next(shoppings.dados.listaRegistros);
        });
    }

    
}
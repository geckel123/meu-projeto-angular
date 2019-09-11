import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Estabelecimento } from "./cadastro-estabelecimentos";
import { BehaviorSubject, Observable, of } from "rxjs";
import { CadastroEstabelecimentosService } from "./cadastro-estabelecimentos.service";
import { catchError, finalize } from "rxjs/operators";
import { ResponseData } from "src/app/shared/interfaces/response-data";
import { ListData } from "src/app/shared/interfaces/list-data";

export class EstabelecimentosDataSource implements DataSource<Estabelecimento> {

    private estabelecimentosSubject = new BehaviorSubject<Estabelecimento[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    private loadedSubject = new BehaviorSubject<boolean>(true);

    public loaded$ = this.loadedSubject.asObservable();

    private totalSubject = new BehaviorSubject<number>(0);

    public total$ = this.totalSubject.asObservable();

    constructor(private estabService: CadastroEstabelecimentosService) {}

    connect(collectionViewer: CollectionViewer): Observable<Estabelecimento[]> {
        return this.estabelecimentosSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.estabelecimentosSubject.complete();
        this.loadingSubject.complete();
        this.loadedSubject.complete();
        this.totalSubject.complete();
    }

    loadEstabelecimentos(query = '', page = 0, size = 5) {
        this.loadingSubject.next(true);
        this.loadedSubject.next(false);

        this.estabService.list(query, page, size)
            .pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((estabelecimentos:ResponseData<ListData<Estabelecimento>>) => {
            this.totalSubject.next(estabelecimentos.dados.totalRegistros);
            this.loadedSubject.next(true);
            return this.estabelecimentosSubject.next(estabelecimentos.dados.listaRegistros);});
    }    
}
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { ResponseData } from "src/app/shared/interfaces/response-data";
import { ListData } from "src/app/shared/interfaces/list-data";
import { PdvNfce } from "./cadastro-pdvs-nfce";
import { CadastroPdvsNfceService } from "./cadastro-pdvs-nfce.service";

export class PdvsNfceDataSource implements DataSource<PdvNfce> {

    private pdvsNfceSubject = new BehaviorSubject<PdvNfce[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    private loadedSubject = new BehaviorSubject<boolean>(true);

    public loaded$ = this.loadedSubject.asObservable();

    private totalSubject = new BehaviorSubject<number>(0);

    public total$ = this.totalSubject.asObservable();

    constructor(private pdvNfceService: CadastroPdvsNfceService) {}

    connect(collectionViewer: CollectionViewer): Observable<PdvNfce[]> {
        return this.pdvsNfceSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.pdvsNfceSubject.complete();
        this.loadingSubject.complete();
        this.loadedSubject.complete();
        this.totalSubject.complete();
    }

    loadPdvsNfce(estab = '', query = '', page = 0, size = 5) {
        this.loadingSubject.next(true);
        this.loadedSubject.next(false);

        this.pdvNfceService.list(estab, query, page, size)
            .pipe(
                catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((pdvsNfce: ResponseData<ListData<PdvNfce>>)=> {
            this.totalSubject.next(pdvsNfce.dados.totalRegistros);
            this.loadedSubject.next(true);
            return this.pdvsNfceSubject.next(pdvsNfce.dados.listaRegistros);
        });
    }

    
}
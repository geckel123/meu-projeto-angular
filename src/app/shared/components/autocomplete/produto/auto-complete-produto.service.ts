import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IProdutoResponse, Produto } from './auto-complete-produto';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class AutoCompleteProdutoService {
    constructor(private http: HttpClient) { }

    search(filter: string = ''): Observable<IProdutoResponse> {
        if(filter) {
            return this.http.get<IProdutoResponse>(API + 'ajax/searchProdutos/' + filter)
            .pipe(
                tap((response: IProdutoResponse) => {
                    response.results = response.results
                        .map(produto => new Produto(produto.codProduto, 
                                            produto.desProduto
                                ));
                    return response;
                })
            );
        } else {
            return new Observable<IProdutoResponse>();
        }
    }
}
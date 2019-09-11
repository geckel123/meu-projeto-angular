import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ResponseData } from 'src/app/shared/interfaces/response-data';
import { ListData } from 'src/app/shared/interfaces/list-data';
import { CadastroShoppingsService } from 'src/app/cadastros/cadastro-shoppings/cadastro-shoppings.service';
import { Shopping } from 'src/app/cadastros/cadastro-shoppings/cadastro-shoppings';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class AutoCompleteShoppingService {
    constructor(private cadShoppingService: CadastroShoppingsService) { }

    search(filter: any = ''): Observable<ResponseData<ListData<Shopping>>> {
        if(filter instanceof Shopping){
            filter = filter.COD_SHOPPING;
        }
        if(filter) {
            return this.cadShoppingService.list(filter,0,50)
            .pipe(
                tap((response: ResponseData<ListData<Shopping>>) => {
                    response.dados.listaRegistros = response.dados.listaRegistros
                        .map(shopping => new Shopping(shopping.COD_SHOPPING,
                            shopping.NOM_SHOPPING,
                            shopping.NOM_RES_SHOPPING));
                    return response;
                })
            );
        } else {
            return new Observable<ResponseData<ListData<Shopping>>>();
        }
    }
}
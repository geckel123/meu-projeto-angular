import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ResponseData } from 'src/app/shared/interfaces/response-data';
import { ListData } from 'src/app/shared/interfaces/list-data';
import { Cidade } from './auto-complete-cidade';
import { CadastroCidadesService } from 'src/app/cadastros/cadastro-cidades/cadastro-cidades.service';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class AutoCompleteCidadeService {
    constructor(private cadCidadeService: CadastroCidadesService) { }

    search(uf:string, filter: string = ''): Observable<ResponseData<ListData<Cidade>>> {
        if(filter) {
            return this.cadCidadeService.list(uf,filter,0,50)
            .pipe(
                tap((response: ResponseData<ListData<Cidade>>) => {
                    response.dados.listaRegistros = response.dados.listaRegistros
                        .map(cidade => new Cidade(cidade.COD_CIDADE,
                                                  cidade.NOM_CIDADE,
                                                  cidade.COD_TERRITORIO,
                                                  cidade.SGL_UF,
                                                  cidade.COD_IBGE,
                                                  cidade.COD_CIDADE_UF,
                                                  cidade.IDT_CIDADE_ZFM,
                                                  cidade.IDT_ATIVO,
                                                  cidade.DAT_ULT_MANUT,
                                                  cidade.MLA_ULT_MANUT));
                    return response;
                })
            );
        } else {
            return new Observable<ResponseData<ListData<Cidade>>>();
        }
    }
}
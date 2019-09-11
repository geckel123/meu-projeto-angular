import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ResponseData } from 'src/app/shared/interfaces/response-data';
import { ListData } from 'src/app/shared/interfaces/list-data';
import { Estabelecimento } from './cadastro-estabelecimentos';
import { NewEstabelecimento } from './new-estabelecimento';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class CadastroEstabelecimentosService {

    constructor(private http: HttpClient) { }

    baseUrl = API + "/arqcorp/portalloja/cadastros/estabelecimentos";

    list(query: string, page: number, size: number) {
      const params = `?query=${query}&page=${page}&size=${size}`;
      let headers = new HttpHeaders({
          "Accept": "application/json"
        });
      let httpOptions = {
          headers: headers
        };
      return this.http
          .get<ResponseData<ListData<Estabelecimento>>>(`${this.baseUrl}${params}`, httpOptions)
          .pipe(map(res => res), catchError(this.handleError));
          
    }

    get(codEstabelecimento: string) {
      let headers = new HttpHeaders({
          "Accept": "application/json"
        });
      let httpOptions = {
          headers: headers
        };
      return this.http
          .get<ResponseData<Estabelecimento>>(`${this.baseUrl}/${codEstabelecimento}`, httpOptions)
          .pipe(map(res => res), catchError(this.handleError));
    }

    incluir(newEstabelecimento: NewEstabelecimento) {
      newEstabelecimento.COD_ESTABELECIMENT = newEstabelecimento.COD_ESTABELECIMENT.toUpperCase();
        return this.http
            .post(this.baseUrl, newEstabelecimento)
            .pipe(catchError(this.handleError));
    }

    alterar(estabelecimento: NewEstabelecimento) {
      return this.http
          .put(`${this.baseUrl}/${estabelecimento.COD_ESTABELECIMENT}`, estabelecimento)
          .pipe(catchError(this.handleError));
    }

    deletar(codEstabelecimento: string) {
      return this.http
          .delete(`${this.baseUrl}/${codEstabelecimento}`)
          .pipe(catchError(this.handleError));
    }

    estabelecimentoJaExiste(codEstabelecimento: string) {

      return this.http
          .get(`${this.baseUrl}/exists/${codEstabelecimento}`)
          .pipe(catchError(this.handleError));
      
    }

    handleError(errorResponse: HttpErrorResponse) {
      if(errorResponse.error instanceof ErrorEvent) {
        console.error("Client side error: " + errorResponse.error.message);
      } else {
        console.error("Server side error: ");
        console.error(errorResponse);
      }
      return throwError("Há um problema com o serviço. Nós fomos notificados e estamos trabalhando nisto. Por-favor tente novamente mais tarde.")
    }


}
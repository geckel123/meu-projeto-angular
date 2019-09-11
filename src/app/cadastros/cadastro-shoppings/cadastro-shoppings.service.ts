import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { NewShopping } from './new-shopping';
import { throwError } from 'rxjs';
import { Shopping } from './cadastro-shoppings';
import { ResponseData } from 'src/app/shared/interfaces/response-data';
import { ListData } from 'src/app/shared/interfaces/list-data';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class CadastroShoppingsService {

    constructor(private http: HttpClient,private alertService: AlertService) { }

    baseUrl = API + "/arqcorp/portalloja/cadastros/shoppings";

    list(query: string, page: number, size: number) {
      const params = `?query=${query}&page=${page}&size=${size}`;
      let headers = new HttpHeaders({
          "Accept": "application/json"
        });
      let httpOptions = {
          headers: headers
        };
      return this.http
          .get<ResponseData<ListData<Shopping>>>(`${this.baseUrl}${params}`, httpOptions)
          .pipe(map(res => res), catchError(this.handleError));
          
    }

    get(codShopping: string) {
      let headers = new HttpHeaders({
          "Accept": "application/json"
        });
      let httpOptions = {
          headers: headers
        };
      return this.http
          .get<ResponseData<Shopping>>(`${this.baseUrl}/${codShopping}`, httpOptions)
          .pipe(map(res => res), catchError(this.handleError));
    }

    incluir(newShopping: NewShopping) {
        newShopping.COD_SHOPPING = newShopping.COD_SHOPPING.toUpperCase();
        return this.http
            .post(this.baseUrl, newShopping)
            .pipe(catchError(this.handleError));
    }

    alterar(shopping: NewShopping) {
      return this.http
          .put(`${this.baseUrl}/${shopping.COD_SHOPPING}`, shopping)
          .pipe(catchError(this.handleError));
    }

    deletar(codShopping: string) {
      return this.http
          .delete(`${this.baseUrl}/${codShopping}`)
          .pipe(catchError(this.handleError));
    }

    shoppingJaExiste(codShopping: string) {

      return this.http
          .get(`${this.baseUrl}/exists/${codShopping}`)
          .pipe(catchError(this.handleError));
      
    }

    handleError(errorResponse: HttpErrorResponse) {
      if(errorResponse.error instanceof ErrorEvent) {
        console.error("Client side error: " + errorResponse.error.message);
      } else {
        console.error("Server side error: ");
        console.error(errorResponse);
      }
      var msg = "Há um problema com o serviço. Nós fomos notificados e estamos trabalhando nisto. Por-favor tente novamente mais tarde."
      return throwError(msg)
    }


}
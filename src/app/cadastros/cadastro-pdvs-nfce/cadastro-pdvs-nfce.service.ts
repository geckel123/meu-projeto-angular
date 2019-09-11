import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ResponseData } from 'src/app/shared/interfaces/response-data';
import { ListData } from 'src/app/shared/interfaces/list-data';
import { PdvNfce } from './cadastro-pdvs-nfce';
import { NewPdvNfce } from './new-pdv-nfce';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class CadastroPdvsNfceService {

    constructor(private http: HttpClient) { }

    baseUrl = API + "/arqcorp/portalloja/cadastros/pdvsnfce";

    list(estab: string, query: string, page: number, size: number) {
      const params = `?estab=${estab}&query=${query}&page=${page}&size=${size}`;
      let headers = new HttpHeaders({
          "Accept": "application/json"
        });
      let httpOptions = {
          headers: headers
        };
      return this.http
          .get<ResponseData<ListData<PdvNfce>>>(`${this.baseUrl}${params}`, httpOptions)
          .pipe(map(res => res), catchError(this.handleError));
          
    }

    get(codEstab: string, codPdv: string) {
      const params = `?estab=${codEstab}&pdv=${codPdv}`;
      let headers = new HttpHeaders({
          "Accept": "application/json"
        });
      let httpOptions = {
          headers: headers
        };
      return this.http
          .get<ResponseData<PdvNfce>>(`${this.baseUrl}/${params}`, httpOptions)
          .pipe(map(res => res), catchError(this.handleError));
    }

    incluir(newPdvNfce: NewPdvNfce) {
        return this.http
            .post(this.baseUrl, newPdvNfce)
            .pipe(catchError(this.handleError));
    }

    alterar(pdvNfce: NewPdvNfce) {
      return this.http
          .put(`${this.baseUrl}/${pdvNfce.COD_ESTAB}/${pdvNfce.NRO_PDV}`, pdvNfce)
          .pipe(catchError(this.handleError));
    }

    deletar(codEstab: string, codPdv: string) {
      const params = `?estab=${codEstab}&pdv=${codPdv}`;
      return this.http
          .delete(`${this.baseUrl}/${params}`)
          .pipe(catchError(this.handleError));
    }

    pdvNfceJaExiste(codEstab: string, codPdv: string) {
      const params = `?estab=${codEstab}&pdv=${codPdv}`;
      return this.http
          .get(`${this.baseUrl}/exists/${params}`)
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
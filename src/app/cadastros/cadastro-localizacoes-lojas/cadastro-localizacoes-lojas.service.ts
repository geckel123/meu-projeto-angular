import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class CadastroLocalizacoesLojasService {

    constructor(private http: HttpClient) { }

    baseUrl = API + "/arqcorp/portalloja/cadastros/localizacoeslojas";

    list(query: string, page: number, size: number) {
        
      const params = `?query=${query}&page=${page}&size=${size}`;
      let headers = new HttpHeaders({
          "Accept": "application/json"
        });
      let httpOptions = {
          headers: headers
        };
      return this.http
          .get<any>(`${this.baseUrl}${params}`, httpOptions)
          .pipe(map(res => res));
          
    }

    get(codLocalizacao: string) {
      let headers = new HttpHeaders({
          "Accept": "application/json"
        });
      let httpOptions = {
          headers: headers
        };
      return this.http
          .get<any>(`${this.baseUrl}/${codLocalizacao}`, httpOptions)
          .pipe(map(res => res));
    }


}
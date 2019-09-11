import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class CadastroCidadesService {

    constructor(private http: HttpClient) { }

    baseUrl = API + "/arqcorp/portalloja/cadastros/cidades";

    list(uf:string, query: string, page: number, size: number) {
        
      const params = `?uf=${uf}&query=${query}&page=${page}&size=${size}`;
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

    get(codCidade: string) {
      let headers = new HttpHeaders({
          "Accept": "application/json"
        });
      let httpOptions = {
          headers: headers
        };
      return this.http
          .get<any>(`${this.baseUrl}/${codCidade}`, httpOptions)
          .pipe(map(res => res));
    }


}
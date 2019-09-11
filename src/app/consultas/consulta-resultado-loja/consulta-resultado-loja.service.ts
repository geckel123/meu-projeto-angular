import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IConsultaResultadoLoja } from './consulta-resultado-loja';
import { tap } from 'rxjs/operators';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class ConsultaResultadoLojaService {

    constructor(private http: HttpClient) { }

    search(dataIni: Date, dataFim: Date, loja: string) {

        const params = {
            "dataIni": dataIni,
            "dataFim": dataFim,
            "selectedLoja": {
                "codEstabeleciment": loja
            }
        };
        let headers = new HttpHeaders({
            "Content-Type":  "application/json",
            "Accept": "application/json"
          });
        let httpOptions = {
            headers: headers
          };
        return this.http
            .post<IConsultaResultadoLoja>(`${API}vendatauros/search`, params, httpOptions);
          
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';


const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class RelatorioDesempVendasService {

    constructor(private http: HttpClient) { }

    search(dataIni: Date, dataFim: Date, loja: string, idcTemSetor: string, tipoRelat: string) {
        

        const params = {
            "dataIni": dataIni,
            "dataFim": dataFim,
            "tipoRelat": tipoRelat,
            "loja": {
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
            .post<any>(`${API}desempvend/report`, params, httpOptions);
          
    }
}
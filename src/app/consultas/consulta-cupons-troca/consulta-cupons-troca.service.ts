import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IConsultaCuponsTroca, IConsultaDetalhesCuponsTroca } from './consulta-cupons-troca';
import { tap } from 'rxjs/operators';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root'})
export class ConsultaCuponsTrocaService {

    constructor(private http: HttpClient) { }

    search(dataIni: Date, dataFim: Date, loja: string, produto: string, cpfCnpjCliente: string) {
        
        if(!loja) {
            loja = null;
        }

        if(!produto) {
            produto = null;
        }

        if(!cpfCnpjCliente) {
            cpfCnpjCliente=null;
        }

        const params = {
            "dataIni": dataIni,
            "dataFim": dataFim,
            "selectedLoja": {
                "codEstabeleciment": loja
            },
            "selectedProd": {
                "codProduto": produto
            },
            "cpfCnpjCliente": cpfCnpjCliente
        };
        let headers = new HttpHeaders({
            "Content-Type":  "application/json",
            "Accept": "application/json"
          });
        let httpOptions = {
            headers: headers
          };
        return this.http
            .post<IConsultaCuponsTroca>(`${API}cupom/search`, params, httpOptions);
          
    }

    searchDetalhe(codEstab:string, nroSeqVenda:number) {
        const params = {
            "codEstab": codEstab,
            "nroSeqVenda": nroSeqVenda
        };
        let headers = new HttpHeaders({
            "Content-Type":  "application/json",
            "Accept": "application/json"
          });
        let httpOptions = {
            headers: headers
          };
        return this.http
            .post<IConsultaDetalhesCuponsTroca>(`${API}cupom/detcupom`, params, httpOptions);
    }
}
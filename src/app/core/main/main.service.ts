import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap,map } from 'rxjs/operators';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { Subject  } from 'rxjs';

export interface UserDado {
    id: number;
    name:string;
    branch: string;
    percent: number;
    phone: number;
    email: string;
    sessionid: string;
}

export interface DadosMessage {
    consequence: string;
    dado: UserDado;
    message: string;
    uuid: string;
    type: string;
  }
const API = environment.ApiUrl;

const WS_URL = environment.WsUrl;

@Injectable({ providedIn: 'root'})
export class MainService {
    public messages: Subject<DadosMessage>;
    constructor(private http: HttpClient, private wsService: WebsocketService) { 
        this.connect();
    }

    search() {
        var student = {};
        student['email'] = "arqcorp";
        var json = JSON.stringify(student); 
        
        let headers = new HttpHeaders({
            "Content-Type":  "application/json; charset=UTF-8",
            "Accept": "application/json",
            "X-Message-Id": "uuid-aqui"
          });
        let httpOptions = {
            headers: headers
          };
        return this.http
            .post<any>(`/arqcorp/v1/usuario/buscar`, json, httpOptions);
          
    }
    getMessages() {
        return this.messages;
    }

    connect() {
        this.messages = <Subject<DadosMessage>>this.wsService.connect(WS_URL).pipe(map(
            (response: MessageEvent): DadosMessage => {
                let data = JSON.parse(response.data);
                return {
                    consequence: data.consequence,
                    dado: {
                        id: data.dado.id,
                        name: data.dado.name,
                        branch: data.dado.branch,
                        percent: data.dado.percent,
                        phone: data.dado.phone,
                        email: data.dado.email,
                        sessionid: data.dado.sessionid
                    },
                    message: data.message,
                    uuid: data.uuid,
                    type: data.type
                };
            }
          ));
    }
}
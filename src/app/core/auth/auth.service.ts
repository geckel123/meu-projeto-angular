import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators'

import { UserService } from '../user/user.service';
import { environment } from '../../../environments/environment'

const API = environment.ApiUrl;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private userService: UserService) { }

  authenticate(userName: string, password: string) {
    var body = {};
    var payLoad = {}
    var dado = {};
    dado['username'] = userName;
    dado['password'] = password;

    payLoad['dado'] = JSON.stringify(dado);
    payLoad['nsFeedBackType']= null

    body['requestInfo'] = null;
    body['responseInfo'] = null;
    body['payLoad'] = payLoad;

    return this.http
      .post(
        '/arqcorp/security/login/', 
        body,
        { 
          headers:{
            "Content-Type":  "application/json; charset=UTF-8",
            "Accept": "application/json",
            "X-Message-Id": "uuid-aqui"
          },
          observe: 'response' 
        }
      )
      .pipe(tap(res => {
        
        var body:any = res.body;
        var dado:any = JSON.parse(body.dados.payLoad.dado);
        
        const authToken = dado.token as any;
        this.userService.setToken(authToken);
        
      }));

  }

  unknow() {
    return this.http.get('https://some-unknown.address');
  }
}

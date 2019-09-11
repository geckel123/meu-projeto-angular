import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
//import '../../shared/js/arqcorp-plugins/arqcorp-rx/arqcorp-rx.js';
//import { DadosMessage } from './main.service';


@Component({
    templateUrl: './main.component.html'
})
export class MainComponent {
    user$: Observable<User>;

    //public messages$: Subject<DadosMessage>;

    constructor(private userService: UserService) {
        this.user$ = userService.getUser();
        //this.messages$ = mainService.getMessages();
    }
    public ngOnInit():void {
        /*this.messages$.subscribe(msg => {

            console.log("Response from websocket: " + JSON.stringify(msg));
          });

        this.sendMsg();
        */
    
        
        /*$(document).ready(function(){
            $("button").click(function(){
                var div = $("#div");  
                div.animate({fontSize: '5em'}, "fast");
                setTimeout(function(){div.animate({fontSize: '1em'}, "fast")},2000);
            });
        });*/
        /*
        var arqCorpWS:any = new Object;
        var Location = document.location;
        var protocol = Location.protocol;
        var ip = Location.hostname;
        arqCorpWS = new WebSocket('wss://' + ip + '/websocket');
  	
        arqCorpWS.onerror = (function(evt) {
            console.log('websocket with problem connection');
            console.log(evt);
            //alerta.processarAlertaDeErro({status: '503'}, null, 'Service Unavailable'); // sem conexao ou servidor inoperante
            });
            
        arqCorpWS.onopen = (function() {
            console.log('connected');
            var student = {};
            student['email'] = "arqcorp";
            var json = JSON.stringify(student); 
            $.hubAjax({
                url: '/arqcorp/v1/usuario/buscar',
                method: 'POST',
                contentType: 'application/json; charset=UTF-8',
                data: json,
                tela: 'Relatorio',
                async: false
            }).delivered(function(jsonReturn) {
                console.log("DELIVERED: "+ jsonReturn);
            }).fail(function(jsonReturn) {
                console.log("ERRO: " + jsonReturn)
            }).done(function(jsonReturn) {
                if (jsonReturn.consequence == 'SUCESSO') {
                    console.log("SUCESSO:" + jsonReturn);
                }
            });
            
        });
        
        arqCorpWS.onmessage = (function(evt) {
            var jsonReturn = JSON.parse(evt.data);
            $.observer().notifyObservers(jsonReturn.uuid, jsonReturn);
            console.log("received: " + evt.data);
        });
        
        arqCorpWS.onclose = (function() {
            if ($.cookie('arqcorpsessionid') == undefined) {
                console.log('closed websocket connection');
                });
            }
        });
        
        window.onbeforeunload = (function() {
            arqCorpWS.onclose = (function () {}); // vamos desabilitar o evento onclose para fechar o websocket de forma segura
            arqCorpWS.close();
            //arqCorpWS.terminate();
        });
        */
    }
    /*sendMsg() {
        this.mainService.search().
        subscribe((res:any) => {
            console.log('DELIVERED');
        },err => {
            console.log('err');
            console.log(err);
        }
        );
        //console.log("new message from client to websocket: ", this.message);
        //this.messages.next(this.message);
        //this.message.message = "";
      }*/
    
 }

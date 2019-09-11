import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AlertService } from "src/app/shared/components/alert/alert.service";
import { ResponseData } from "src/app/shared/interfaces/response-data";
import { CadastroPdvsNfceService } from "../cadastro-pdvs-nfce.service";
import { PdvNfce } from "../cadastro-pdvs-nfce";

@Component({
    templateUrl: "./delecao-pdv-nfce.component.html"
})
export class DelecaoPdvNfceComponent implements OnInit{
    
    constructor(private route: ActivatedRoute,
        private cadPdvNfceService: CadastroPdvsNfceService,
        private alertService: AlertService,
        private router: Router) {}

    pdvNfce$:Observable<ResponseData<PdvNfce>>;

    pdvNfce:PdvNfce;


    ngOnInit(): void {
        this.pdvNfce$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
              return this.cadPdvNfceService.get(params.get('estab'), params.get('pdv'));
            })
          );
        this.loadData();
    }

    loadData(): void {
        this.pdvNfce$.subscribe(
            pdvNfce => {
                this.pdvNfce = pdvNfce.dados;
            }
        )
    }

    voltar() {
        this.router.navigate(['cadastros/cadastro-pdvs-nfce']);
    }

    deletar() {
        if(confirm(`Deseja realmente deletar o PDV NFCE ${this.pdvNfce.COD_ESTAB} - ${this.pdvNfce.NRO_PDV}?` )) {
            
            this.cadPdvNfceService
                .deletar(this.pdvNfce.COD_ESTAB, this.pdvNfce.NRO_PDV)
                .subscribe(
                    () => {
                        this.router.navigate(['cadastros/cadastro-pdvs-nfce']);
                        this.alertService.success("PDV NFCE deletado com sucesso.",10000, false);
                    },
                    err => {
                        console.log(err);
                        this.router.navigate(['cadastros/cadastro-pdvs-nfce']);
                        this.alertService.danger("ERRO! Nao foi possivel deletar o PDV NFCE.");
                    }
                );
        }
    }
    
}
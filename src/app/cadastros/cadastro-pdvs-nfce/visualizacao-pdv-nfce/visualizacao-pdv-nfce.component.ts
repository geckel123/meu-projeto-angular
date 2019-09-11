import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { ResponseData } from "src/app/shared/interfaces/response-data";
import { CadastroPdvsNfceService } from "../cadastro-pdvs-nfce.service";
import { PdvNfce } from "../cadastro-pdvs-nfce";

@Component({
    templateUrl: "./visualizacao-pdv-nfce.component.html"
})
export class VisualizacaoPdvNfceComponent implements OnInit{
    
    constructor(private route: ActivatedRoute,
        private cadPdvNfceService: CadastroPdvsNfceService,
        private router: Router) {}

    pdvNfce$:Observable<ResponseData<PdvNfce>>;

    pdvNfce:PdvNfce;

    ngOnInit(): void {
        this.pdvNfce$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
              return this.cadPdvNfceService.get(params.get('estab'),params.get('pdv'));
            })
          );
    }

    voltar() {
        this.router.navigate(['cadastros/cadastro-pdvs-nfce']);
    }
    
}
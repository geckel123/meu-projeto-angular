import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Shopping } from "../cadastro-shoppings";
import { CadastroShoppingsService } from "../cadastro-shoppings.service";
import { ResponseData } from "src/app/shared/interfaces/response-data";

@Component({
    templateUrl: "./visualizacao-shopping.component.html"
})
export class VisualizacaoShoppingComponent implements OnInit{
    
    constructor(private route: ActivatedRoute,
        private cadShoppingService: CadastroShoppingsService,
        private router: Router) {}

    shopping$:Observable<ResponseData<Shopping>>;

    shopping:Shopping;

    ngOnInit(): void {
        this.shopping$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
              return this.cadShoppingService.get(params.get('id'));
            })
          );
    }

    voltar() {
        this.router.navigate(['cadastros/cadastro-shoppings']);
    }
    
}
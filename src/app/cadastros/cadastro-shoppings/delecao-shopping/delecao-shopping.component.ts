import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { CadastroShoppingsService } from "../cadastro-shoppings.service";
import { Observable } from "rxjs";
import { Shopping } from "../cadastro-shoppings";
import { switchMap } from "rxjs/operators";
import { AlertService } from "src/app/shared/components/alert/alert.service";
import { ResponseData } from "src/app/shared/interfaces/response-data";

@Component({
    templateUrl: "./delecao-shopping.component.html"
})
export class DelecaoShoppingComponent implements OnInit{
    
    constructor(private route: ActivatedRoute,
        private cadShoppingService: CadastroShoppingsService,
        private alertService: AlertService,
        private router: Router) {}

    shopping$:Observable<ResponseData<Shopping>>;

    shopping:Shopping;


    ngOnInit(): void {
        this.shopping$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
              return this.cadShoppingService.get(params.get('id'));
            })
          );
        this.loadData();
    }

    loadData(): void {
        this.shopping$.subscribe(
            shopping => {
                this.shopping = shopping.dados;
            }
        )
    }

    voltar() {
        this.router.navigate(['cadastros/cadastro-shoppings']);
    }

    deletar() {
        if(confirm(`Deseja realmente deletar o Shopping ${this.shopping.COD_SHOPPING} - ${this.shopping.NOM_SHOPPING}?` )) {
            
            this.cadShoppingService
                .deletar(this.shopping.COD_SHOPPING)
                .subscribe(
                    () => {
                        this.router.navigate(['cadastros/cadastro-shoppings']);
                        this.alertService.success("Shopping deletado com sucesso.",10000, false);
                    },
                    err => {
                        console.log(err);
                        this.router.navigate(['cadastros/cadastro-shoppings']);
                        this.alertService.danger("ERRO! Nao foi possivel deletar o Shopping.");
                    }
                );
        }
    }
    
}
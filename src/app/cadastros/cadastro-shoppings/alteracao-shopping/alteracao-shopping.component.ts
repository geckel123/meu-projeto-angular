import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Shopping } from "../cadastro-shoppings";
import { CadastroShoppingsService } from "../cadastro-shoppings.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertService } from "src/app/shared/components/alert/alert.service";
import { NewShopping } from "../new-shopping";
import { ResponseData } from "src/app/shared/interfaces/response-data";

@Component({
    templateUrl: "./alteracao-shopping.component.html"
})
export class AlteracaoShoppingComponent implements OnInit{
    
    constructor(private fb: FormBuilder,
        private cadShoppingService: CadastroShoppingsService,
        private router: Router,
        private alertService: AlertService,
        private route: ActivatedRoute) {}

    shopping$:Observable<ResponseData<Shopping>>;
    shoppingForm: FormGroup;

    ngOnInit(): void {
        this.shoppingForm = this.fb.group({
            COD_SHOPPING: [''],
            NOM_SHOPPING: ['', 
                [
                Validators.required,
                Validators.maxLength(30)
                ]
            ],
            NOM_RES_SHOPPING: ['', 
                [
                Validators.required,
                Validators.maxLength(10)
                ]
            ]
        });

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
                this.shoppingForm.setValue({
                    COD_SHOPPING: shopping.dados.COD_SHOPPING,
                    NOM_SHOPPING: shopping.dados.NOM_SHOPPING,
                    NOM_RES_SHOPPING: shopping.dados.NOM_RES_SHOPPING
                });
            }
        )
    }

    voltar() {
        this.router.navigate(['cadastros/cadastro-shoppings']);
    }


    alterar() {
        if(this.shoppingForm.valid && !this.shoppingForm.pending) {
            const shopping = this.shoppingForm.getRawValue() as NewShopping;
            this.cadShoppingService
                .alterar(shopping)
                .subscribe(
                    () => {
                        this.router.navigate(['cadastros/cadastro-shoppings']);
                        this.alertService.success("Shopping alterado com sucesso.",10000, false);
                    },
                    err => {
                        console.log(err);
                        this.router.navigate(['cadastros/cadastro-shoppings']);
                        this.alertService.danger("ERRO! Nao foi possivel alterar o Shopping.");
                    }
                );
        }
    }

    
}
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CodigoShoppingJaExisteValidatorService } from "../codigo-shopping-ja-existe.validator.service";
import { CadastroShoppingsService } from "../cadastro-shoppings.service";
import { Router } from "@angular/router";
import { NewShopping } from "../new-shopping";
import { AlertService } from "src/app/shared/components/alert/alert.service";

@Component({
    templateUrl: "./inclusao-shopping.component.html",
    providers: [ CodigoShoppingJaExisteValidatorService ]
})
export class InclusaoShoppingComponent implements OnInit {
    
    shoppingForm: FormGroup;

    constructor(private fb: FormBuilder,
        private shoppingJAExisteValidatorService: CodigoShoppingJaExisteValidatorService,
        private cadShoppingService: CadastroShoppingsService,
        private router: Router,
        private alertService: AlertService) {}

    ngOnInit(): void {
        this.shoppingForm = this.fb.group({
            COD_SHOPPING: ['', 
                [
                Validators.required,
                Validators.maxLength(2)
                ],
                this.shoppingJAExisteValidatorService.checkShoppingJaExiste()
            ],
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
 
    }

    voltar() {
        this.router.navigate(['cadastros/cadastro-shoppings']);
    }

    incluir() {
        if(this.shoppingForm.valid && !this.shoppingForm.pending) {
            const newShopping = this.shoppingForm.getRawValue() as NewShopping;
            this.cadShoppingService
                .incluir(newShopping)
                .subscribe(
                    () => {
                        this.router.navigate(['cadastros/cadastro-shoppings']);
                        this.alertService.success("Shopping incluido com sucesso.",10000, false);
                    },
                    err => {
                        console.log(err);
                        this.router.navigate(['cadastros/cadastro-shoppings']);
                        this.alertService.danger("ERRO! Nao foi possivel incluir o Shopping.");
                    }
                );
        }
    }

    
}
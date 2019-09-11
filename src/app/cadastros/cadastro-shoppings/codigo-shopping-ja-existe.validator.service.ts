import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { debounceTime, switchMap, map, first } from 'rxjs/operators';
import { CadastroShoppingsService } from './cadastro-shoppings.service';
import { ResponseData } from 'src/app/shared/interfaces/response-data';

@Injectable()
export class CodigoShoppingJaExisteValidatorService {
    constructor(private shoppingService: CadastroShoppingsService) {}

    checkShoppingJaExiste() {
        return (control: AbstractControl) => {
            return control
                .valueChanges
                .pipe(debounceTime(300))
                .pipe(switchMap(codShopping => 
                        this.shoppingService.shoppingJaExiste(codShopping)
                ))
                .pipe(map((jaExiste:ResponseData<Boolean>) => jaExiste.dados ? {shoppingJaExiste: true} : null))
                .pipe(first());

        }
    }
}
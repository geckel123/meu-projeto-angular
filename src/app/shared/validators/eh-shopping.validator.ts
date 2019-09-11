import { AbstractControl } from '@angular/forms';
import { Shopping } from 'src/app/cadastros/cadastro-shoppings/cadastro-shoppings';

export function EhShoppingValidator (control: AbstractControl) {

    var shopping = control.value;
    if(shopping !== "" && shopping !== null) {
        if (typeof shopping.COD_SHOPPING === "undefined")
            return { naoEhShopping: true };
    }
    
    return null;
}
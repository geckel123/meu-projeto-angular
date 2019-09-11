import { AbstractControl } from '@angular/forms';
import { Cidade } from '../components/autocomplete/cidade/auto-complete-cidade';

export function EhCidadeValidator (control: AbstractControl) {

    var cidade = control.value;
    if(cidade !== '' && cidade !== null) {
        if (typeof cidade.COD_CIDADE === "undefined")
            return { naoEhCidade: true };
    }

    return null;
}
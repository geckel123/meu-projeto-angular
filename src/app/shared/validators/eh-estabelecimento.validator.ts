import { AbstractControl } from '@angular/forms';
import { Estabelecimento } from 'src/app/cadastros/cadastro-estabelecimentos/cadastro-estabelecimentos';

export function EhEstabelecimentoValidator (control: AbstractControl) {

    var estabelecimento = control.value;
    if(estabelecimento !== '' && estabelecimento !== null) {
        if (typeof estabelecimento.COD_ESTABELECIMENT === "undefined")
          return { naoEhEstabelecimento: true };
    }
    
    return null;
}
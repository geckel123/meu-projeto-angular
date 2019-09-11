import { AbstractControl } from '@angular/forms';
export function SuframaValidator (control: AbstractControl) {

    const uf = control.get('SGL_UF').value;
    const suframa = control.get('COD_INSCRI_SUFRAMA').value;
    if(uf === 'AM') {
        if(suframa.trim() === '')
            return { suframaObrigatoria: true };
    }
    return null;
}
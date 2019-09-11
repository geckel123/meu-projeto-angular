import { AbstractControl } from '@angular/forms';
export function RepartFiscalValidator (control: AbstractControl) {

    const uf = control.get('SGL_UF').value;
    const repartFiscal = control.get('COD_REPART_FISCAL').value;
    if(uf === 'AM') {
        if(repartFiscal.trim() === '')
            return { repartFiscalObrigatoria: true };
    }
    return null;
}
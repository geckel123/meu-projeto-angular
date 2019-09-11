import { AbstractControl } from '@angular/forms';
export function MesmaRotaValidator (control: AbstractControl) {

    const tipEstab = control.get('IDT_TIP_ESTAB').value;
    const mesmaRota = control.get('IDT_LR_MESMAROTA').value;
    if(tipEstab === 'L') {
        if(mesmaRota.trim() === '')
            return { mesmaRotaObrigatoria: true };
    }else {
        if(mesmaRota.trim() !== '')
            return { mesmaRotaNaoLoja: true };
    }

    return null;
}
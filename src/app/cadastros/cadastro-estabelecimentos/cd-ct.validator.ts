import { AbstractControl } from '@angular/forms';
export function CdCtValidator (control: AbstractControl) {

    const idtCdCt = control.get('IDT_CD_CT').value;
    const tipEstab = control.get('IDT_TIP_ESTAB').value;
    if(tipEstab !== 'C') {
        if(idtCdCt === 'S')
            return { apenasCdCt: true };
    }
    return null;
}
import { AbstractControl } from '@angular/forms';
import { Cpu } from 'src/app/cadastros/cadastro-cpus/cadastro-cpus';

export function EhCpuValidator (control: AbstractControl) {

    var cpu = control.value;
    if(cpu !== '' && cpu !== null) {
        if (typeof cpu.COD_CPU === "undefined")
            return { naoEhCpu: true };
    }
    
    return null;
}
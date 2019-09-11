import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { debounceTime, switchMap, map, first } from 'rxjs/operators';
import { ResponseData } from 'src/app/shared/interfaces/response-data';
import { CadastroPdvsNfceService } from './cadastro-pdvs-nfce.service';
import { Observable } from 'rxjs';

@Injectable()
export class CodigoPdvJaExisteValidatorService {
    constructor(private pdvNfceService: CadastroPdvsNfceService) {}

    checkPdvNfceJaExiste(estab) {
        return (control: AbstractControl) => {
            return control
                .valueChanges
                .pipe(debounceTime(300))
                .pipe(switchMap(pdv => {
                            var estabValue = ''
                            if(typeof estab.value.COD_ESTABELECIMENT !== "undefined") 
                                estabValue = estab.value.COD_ESTABELECIMENT;
                            else 
                                return new Observable<ResponseData<Boolean>>((subscriber) => {
                                    subscriber.next(new ResponseData<Boolean>("SUCESSO",true));
                                });
                            return this.pdvNfceService.pdvNfceJaExiste(estabValue, pdv);
                        }
                ))
                .pipe(map((jaExiste:ResponseData<Boolean>) => jaExiste.dados ? {pdvNfceJaExiste: true} : null))
                .pipe(first());

        }
    }
}